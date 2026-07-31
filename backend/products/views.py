from rest_framework import generics

from .models import Product
from .serializers import ProductSerializer
from permissions.permissions import IsAdminOrEmployee


class ProductListCreateView(
    generics.ListCreateAPIView
):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]