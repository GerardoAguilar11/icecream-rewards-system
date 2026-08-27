from django.db import transaction

from django.db.models import Q

from django.db.models.deletion import (
    ProtectedError,
)

from rest_framework import (
    generics,
    status,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import (
    Response,
)

from rest_framework.views import (
    APIView,
)

from permissions.permissions import (
    IsAdmin,
    IsAdminOrEmployee,
)

from .models import Customer

from .serializers import (
    CustomerSerializer,
)


class CustomerListView(
    generics.ListAPIView
):

    queryset = (
        Customer.objects
        .select_related("user")
        .all()
    )

    serializer_class = (
        CustomerSerializer
    )

    permission_classes = [
        IsAdminOrEmployee
    ]


class CustomerDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = (
        Customer.objects
        .select_related("user")
        .all()
    )

    serializer_class = (
        CustomerSerializer
    )


    def get_permissions(self):

        if self.request.method == "GET":

            permission_classes = [
                IsAdminOrEmployee
            ]

        else:

            permission_classes = [
                IsAdmin
            ]

        return [
            permission()
            for permission
            in permission_classes
        ]


    @transaction.atomic
    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        customer = self.get_object()

        user = customer.user


        try:

            user.delete()

        except ProtectedError:

            return Response(
                {
                    "detail": (
                        "No se puede eliminar este cliente "
                        "porque tiene compras o movimientos "
                        "relacionados."
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )


        return Response(
            status=(
                status
                .HTTP_204_NO_CONTENT
            )
        )


class CustomerProfileView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def get_customer(
        self,
        request
    ):

        if (
            request.user.role
            != "CUSTOMER"
        ):

            return None

        try:

            return (
                Customer.objects
                .select_related("user")
                .get(
                    user=request.user
                )
            )

        except Customer.DoesNotExist:

            return None


    def get(
        self,
        request
    ):

        customer = self.get_customer(
            request
        )


        if not customer:

            return Response(
                {
                    "detail": (
                        "No existe un perfil de cliente "
                        "asociado a este usuario."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        serializer = CustomerSerializer(
            customer
        )


        return Response(
            serializer.data
        )


    def patch(
        self,
        request
    ):

        customer = self.get_customer(
            request
        )


        if not customer:

            return Response(
                {
                    "detail": (
                        "No existe un perfil de cliente "
                        "asociado a este usuario."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        serializer = CustomerSerializer(
            customer,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CustomerSearchView(
    generics.ListAPIView
):

    serializer_class = (
        CustomerSerializer
    )

    permission_classes = [
        IsAdminOrEmployee
    ]


    def get_queryset(self):

        query = self.request.GET.get(
            "q",
            ""
        ).strip()

        limit = self.request.GET.get(
            "limit"
        )


        queryset = (
            Customer.objects
            .select_related("user")
            .filter(
                Q(
                    customer_code__icontains=query
                )
                |
                Q(
                    user__first_name__icontains=query
                )
                |
                Q(
                    user__last_name__icontains=query
                )
                |
                Q(
                    user__email__icontains=query
                )
                |
                Q(
                    phone__icontains=query
                )
            )
            .order_by(
                "user__first_name",
                "user__last_name",
            )
        )


        if limit:

            try:
                limit = int(limit)

                if limit > 0:
                    queryset = queryset[:limit]

            except ValueError:
                pass


        return queryset