from rest_framework import serializers

from .models import Reward, RewardRedemption


class RewardSerializer(serializers.ModelSerializer):

    class Meta:

        model = Reward

        fields = [
            "id",
            "name",
            "description",
            "points_required",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


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