from decimal import Decimal

from rest_framework import serializers

from .models import (
    Reward,
    RewardRedemption,
    RewardType,
)


class RewardSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    reward_type_display = serializers.CharField(
        source="get_reward_type_display",
        read_only=True,
    )

    class Meta:

        model = Reward

        fields = [
            "id",
            "name",
            "description",
            "points_required",
            "reward_type",
            "reward_type_display",
            "discount_value",
            "product",
            "product_name",
            "free_product_name",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "reward_type_display",
            "product_name",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        instance = getattr(
            self,
            "instance",
            None,
        )

        reward_type = attrs.get(
            "reward_type",
            getattr(
                instance,
                "reward_type",
                RewardType.FREE_PRODUCT,
            ),
        )

        discount_value = attrs.get(
            "discount_value",
            getattr(
                instance,
                "discount_value",
                None,
            ),
        )

        product = attrs.get(
            "product",
            getattr(
                instance,
                "product",
                None,
            ),
        )

        free_product_name = attrs.get(
            "free_product_name",
            getattr(
                instance,
                "free_product_name",
                "",
            ),
        )

        free_product_name = (
            free_product_name.strip()
            if free_product_name
            else ""
        )

        if reward_type == RewardType.FREE_PRODUCT:

            if discount_value is not None:
                raise serializers.ValidationError({
                    "discount_value": (
                        "Una recompensa de producto gratis "
                        "no puede tener un valor de descuento."
                    )
                })

            if not product and not free_product_name:
                raise serializers.ValidationError({
                    "free_product_name": (
                        "Selecciona un producto del catálogo "
                        "o indica el producto que se entregará."
                    )
                })

            if product and free_product_name:
                raise serializers.ValidationError({
                    "free_product_name": (
                        "Utiliza un producto del catálogo "
                        "o escribe un producto independiente, "
                        "pero no ambos."
                    )
                })

        elif (
            reward_type
            == RewardType.PERCENTAGE_DISCOUNT
        ):

            if discount_value is None:
                raise serializers.ValidationError({
                    "discount_value": (
                        "Indica el porcentaje de descuento."
                    )
                })

            if (
                discount_value <= Decimal("0")
                or discount_value > Decimal("100")
            ):
                raise serializers.ValidationError({
                    "discount_value": (
                        "El porcentaje debe ser mayor a 0 "
                        "y no puede superar el 100%."
                    )
                })

            if product:
                raise serializers.ValidationError({
                    "product": (
                        "Un descuento porcentual no puede "
                        "estar asociado a un producto."
                    )
                })

            if free_product_name:
                raise serializers.ValidationError({
                    "free_product_name": (
                        "Un descuento porcentual no puede "
                        "tener un producto gratuito."
                    )
                })

        elif (
            reward_type
            == RewardType.FIXED_DISCOUNT
        ):

            if discount_value is None:
                raise serializers.ValidationError({
                    "discount_value": (
                        "Indica el monto del descuento."
                    )
                })

            if discount_value <= Decimal("0"):
                raise serializers.ValidationError({
                    "discount_value": (
                        "El descuento debe ser mayor a $0."
                    )
                })

            if product:
                raise serializers.ValidationError({
                    "product": (
                        "Un descuento fijo no puede "
                        "estar asociado a un producto."
                    )
                })

            if free_product_name:
                raise serializers.ValidationError({
                    "free_product_name": (
                        "Un descuento fijo no puede "
                        "tener un producto gratuito."
                    )
                })

        return attrs


class RewardRedemptionSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.user.get_full_name",
        read_only=True
    )

    customer_code = serializers.CharField(
        source="customer.customer_code",
        read_only=True
    )

    reward_name = serializers.CharField(
        source="reward.name",
        read_only=True
    )

    employee_name = serializers.CharField(
        source="employee.get_full_name",
        read_only=True
    )

    class Meta:

        model = RewardRedemption

        fields = [
            "id",
            "customer_name",
            "customer_code",
            "reward_name",
            "employee_name",
            "points_used",
            "status",
            "created_at",
            "cancelled_at",
        ]

        read_only_fields = [
            "id",
            "customer_name",
            "customer_code",
            "reward_name",
            "employee_name",
            "points_used",
            "status",
            "created_at",
            "cancelled_at",
        ]


class RewardRedemptionCreateSerializer(serializers.Serializer):

    customer = serializers.IntegerField()

    reward = serializers.IntegerField()