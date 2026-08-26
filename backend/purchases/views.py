from django.shortcuts import get_object_or_404

from rest_framework import (
    generics,
    status,
)

from rest_framework.exceptions import (
    PermissionDenied,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework.views import APIView


from permissions.permissions import (
    IsAdminOrEmployee,
)

from customers.models import Customer

from .models import Purchase

from .serializers import (
    PurchaseCreateSerializer,
    PurchaseSerializer,
)

from .services import PurchaseService


class PurchaseListCreateView(
    APIView
):

    permission_classes = [
        IsAdminOrEmployee
    ]


    def get(
        self,
        request
    ):

        purchases = (
            Purchase.objects
            .select_related(
                "customer__user",
                "employee",
                "redemption",
                "redemption__reward",
            )
            .prefetch_related(
                "items__product"
            )
            .order_by(
                "-created_at"
            )
        )

        serializer = PurchaseSerializer(
            purchases,
            many=True
        )

        return Response(
            serializer.data
        )


    def post(
        self,
        request
    ):

        serializer = (
            PurchaseCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        purchase = (
            PurchaseService
            .create_purchase(
                serializer.validated_data,
                request.user
            )
        )

        serializer = PurchaseSerializer(
            purchase
        )

        return Response(
            serializer.data,
            status=(
                status
                .HTTP_201_CREATED
            )
        )


class PurchaseDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        Purchase.objects
        .select_related(
            "customer__user",
            "employee",
            "redemption",
            "redemption__reward",
        )
        .prefetch_related(
            "items__product"
        )
    )

    serializer_class = (
        PurchaseSerializer
    )

    permission_classes = [
        IsAdminOrEmployee
    ]


class CustomerPurchaseHistoryView(
    APIView
):

    permission_classes = [
        IsAdminOrEmployee
    ]


    def get(
        self,
        request,
        customer_code
    ):

        customer = get_object_or_404(
            Customer.objects
            .select_related(
                "user"
            ),
            customer_code=customer_code
        )

        purchases = (
            Purchase.objects
            .filter(
                customer=customer
            )
            .select_related(
                "employee",
                "customer__user",
                "redemption",
                "redemption__reward",
            )
            .prefetch_related(
                "items__product"
            )
            .order_by(
                "-created_at"
            )
        )

        return Response({

            "customer": {
                "name": (
                    customer.user
                    .get_full_name()
                ),

                "customer_code": (
                    customer.customer_code
                ),

                "points": (
                    customer.points
                ),
            },

            "purchases": (
                PurchaseSerializer(
                    purchases,
                    many=True
                ).data
            ),

        })


class MyPurchaseListView(
    generics.ListAPIView
):

    serializer_class = (
        PurchaseSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


    def get_queryset(
        self
    ):

        user = self.request.user

        if user.role != "CUSTOMER":

            raise PermissionDenied(
                "Esta consulta está disponible "
                "únicamente para clientes."
            )


        try:

            customer = (
                Customer.objects
                .get(
                    user=user
                )
            )

        except Customer.DoesNotExist:

            raise PermissionDenied(
                "No existe un perfil de cliente "
                "asociado a este usuario."
            )


        return (
            Purchase.objects
            .filter(
                customer=customer
            )
            .select_related(
                "customer__user",
                "employee",
                "redemption",
                "redemption__reward",
            )
            .prefetch_related(
                "items__product"
            )
            .order_by(
                "-created_at"
            )
        )


class MyPurchaseDetailView(
    generics.RetrieveAPIView
):

    serializer_class = (
        PurchaseSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]


    def get_queryset(
        self
    ):

        user = self.request.user

        if user.role != "CUSTOMER":

            raise PermissionDenied(
                "Esta consulta está disponible "
                "únicamente para clientes."
            )


        try:

            customer = (
                Customer.objects
                .get(
                    user=user
                )
            )

        except Customer.DoesNotExist:

            raise PermissionDenied(
                "No existe un perfil de cliente "
                "asociado a este usuario."
            )


        return (
            Purchase.objects
            .filter(
                customer=customer
            )
            .select_related(
                "customer__user",
                "employee",
                "redemption",
                "redemption__reward",
            )
            .prefetch_related(
                "items__product"
            )
        )


class PurchaseCancelView(
    APIView
):

    permission_classes = [
        IsAdminOrEmployee
    ]


    def patch(
        self,
        request,
        pk
    ):

        purchase = get_object_or_404(
            Purchase,
            pk=pk
        )


        try:

            purchase = (
                PurchaseService
                .cancel_purchase(
                    purchase
                )
            )

        except ValueError as e:

            return Response(
                {
                    "detail": str(e)
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )


        serializer = PurchaseSerializer(
            purchase
        )


        return Response(
            serializer.data
        )