from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )


    class Meta:

        model = Customer

        fields = [
            "id",
            "customer_code",
            "email",
            "first_name",
            "last_name",
            "phone",
            "points",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "customer_code",
            "points",
            "created_at",
            "updated_at",
        ]