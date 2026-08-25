from rest_framework import generics

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
            for permission in permission_classes
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
            for permission in permission_classes
        ]