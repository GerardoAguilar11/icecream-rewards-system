from django.db.models.deletion import ProtectedError

from rest_framework import (
    generics,
    status,
)

from rest_framework.response import Response

from permissions.permissions import (
    IsAdmin,
    IsAdminOrEmployee,
)

from .models import Product
from .serializers import ProductSerializer


class ProductListCreateView(
    generics.ListCreateAPIView
):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer


    def get_permissions(self):

        if self.request.method == "POST":
            permission_classes = [
                IsAdmin
            ]

        else:
            permission_classes = [
                IsAdminOrEmployee
            ]

        return [
            permission()
            for permission
            in permission_classes
        ]


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer


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


    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        product = self.get_object()

        try:
            product.delete()

        except ProtectedError:

            return Response(
                {
                    "detail": (
                        "No se puede eliminar este producto "
                        "porque ya fue utilizado en una o más compras. "
                        "Puedes desactivarlo para evitar que siga "
                        "apareciendo en nuevas compras."
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