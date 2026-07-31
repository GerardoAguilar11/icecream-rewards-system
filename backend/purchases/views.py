from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from permissions.permissions import IsAdminOrEmployee

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