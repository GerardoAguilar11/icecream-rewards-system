from rest_framework import serializers

from .models import (Purchase,PurchaseItem,)


class PurchaseItemCreateSerializer(serializers.Serializer):

    product = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1
    )

class PurchaseCreateSerializer(serializers.Serializer):

    customer = serializers.IntegerField()

    items = PurchaseItemCreateSerializer(
        many=True
    )

class PurchaseItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:

        model = PurchaseItem

        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "subtotal",
        ]

class PurchaseSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.user.get_full_name",
        read_only=True
    )

    customer_code = serializers.CharField(
        source="customer.customer_code",
        read_only=True
    )

    employee_name = serializers.CharField(
        source="employee.get_full_name",
        read_only=True
    )

    items = PurchaseItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Purchase

        fields = [
            "id",
            "customer_name",
            "customer_code",
            "employee_name",
            "total_amount",
            "points_earned",
            "status",
            "items",
            "created_at",
        ]