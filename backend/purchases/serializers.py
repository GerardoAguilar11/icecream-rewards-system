from rest_framework import serializers

from customers.models import Customer
from products.models import Product
from rewards.models import Reward

from .models import (
    Purchase,
    PurchaseItem,
)


class PurchaseItemCreateSerializer(
    serializers.Serializer
):

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(
            is_active=True
        )
    )

    quantity = serializers.IntegerField(
        min_value=1
    )


class PurchaseCreateSerializer(
    serializers.Serializer
):

    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all()
    )

    reward = serializers.PrimaryKeyRelatedField(
        queryset=Reward.objects.filter(
            is_active=True
        ),
        required=False,
        allow_null=True,
        write_only=True
    )

    items = PurchaseItemCreateSerializer(
        many=True,
        allow_empty=False
    )


class PurchaseItemSerializer(
    serializers.ModelSerializer
):

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


class PurchaseSerializer(
    serializers.ModelSerializer
):

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

    redemption_id = serializers.IntegerField(
        source="redemption.id",
        read_only=True,
        allow_null=True
    )

    reward_name = serializers.CharField(
        source="redemption.reward.name",
        read_only=True,
        allow_null=True
    )

    reward_points_used = serializers.IntegerField(
        source="redemption.points_used",
        read_only=True,
        allow_null=True
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
            "used_reward",
            "redemption_id",
            "reward_name",
            "reward_points_used",
            "status",
            "items",
            "created_at",
        ]


class CustomerPurchaseHistorySerializer(
    serializers.Serializer
):

    customer = serializers.DictField()

    purchases = PurchaseSerializer(
        many=True
    )