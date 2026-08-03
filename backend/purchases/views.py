from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404

from permissions.permissions import IsAdminOrEmployee

from customers.models import Customer

from .models import Purchase
from .serializers import (
    PurchaseCreateSerializer,
    PurchaseSerializer,
)
from .services import PurchaseService


class PurchaseCreateView(APIView):

    permission_classes = [
        IsAdminOrEmployee
    ]

    def post(self, request):

        serializer = PurchaseCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        purchase = PurchaseService.create_purchase(
            serializer.validated_data,
            request.user
        )

        serializer = PurchaseSerializer(
            purchase
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class PurchaseListView(generics.ListAPIView):

    queryset = (
        Purchase.objects
        .select_related(
            "customer__user",
            "employee",
        )
        .prefetch_related(
            "items__product"
        )
        .order_by("-created_at")
    )

    serializer_class = PurchaseSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]


class PurchaseDetailView(generics.RetrieveAPIView):

    queryset = (
        Purchase.objects
        .select_related(
            "customer__user",
            "employee",
        )
        .prefetch_related(
            "items__product"
        )
    )

    serializer_class = PurchaseSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]


class CustomerPurchaseHistoryView(APIView):

    permission_classes = [
        IsAdminOrEmployee
    ]

    def get(self, request, customer_code):

        customer = get_object_or_404(
            Customer.objects.select_related(
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
                "name": customer.user.get_full_name(),
                "customer_code": customer.customer_code,
                "points": customer.points,
            },
            "purchases": PurchaseSerializer(
                purchases,
                many=True
            ).data,
        })


class PurchaseCancelView(APIView):

    permission_classes = [
        IsAdminOrEmployee
    ]

    def patch(self, request, pk):

        purchase = get_object_or_404(
            Purchase,
            pk=pk
        )

        try:

            purchase = PurchaseService.cancel_purchase(
                purchase
            )

        except ValueError as e:

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PurchaseSerializer(
            purchase
        )

        return Response(
            serializer.data
        )