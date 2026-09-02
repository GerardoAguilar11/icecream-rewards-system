from django.db import transaction

from rest_framework import serializers

from authentication.models import CustomUser

from .models import Customer


class CustomerSerializer(
    serializers.ModelSerializer
):

    email = serializers.EmailField(
        source="user.email"
    )

    first_name = serializers.CharField(
        source="user.first_name"
    )

    last_name = serializers.CharField(
        source="user.last_name"
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
            "id",
            "customer_code",
            "points",
            "created_at",
            "updated_at",
        ]


    def validate_email(
        self,
        value
    ):

        value = value.strip().lower()

        users = CustomUser.objects.filter(
            email__iexact=value
        )

        if self.instance:

            users = users.exclude(
                pk=self.instance.user_id
            )

        if users.exists():

            raise serializers.ValidationError(
                "Ya existe un usuario con "
                "este correo electrónico."
            )

        return value


    def validate_first_name(
        self,
        value
    ):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "El nombre no puede estar vacío."
            )

        return value


    def validate_last_name(
        self,
        value
    ):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "Los apellidos no pueden estar vacíos."
            )

        return value


    @transaction.atomic
    def update(
        self,
        instance,
        validated_data
    ):

        user_data = validated_data.pop(
            "user",
            {}
        )

        user = instance.user


        if "email" in user_data:

            user.email = (
                user_data["email"]
            )


        if "first_name" in user_data:

            user.first_name = (
                user_data["first_name"]
            )


        if "last_name" in user_data:

            user.last_name = (
                user_data["last_name"]
            )


        user.save(
            update_fields=[
                "email",
                "first_name",
                "last_name",
            ]
        )


        if "phone" in validated_data:

            instance.phone = (
                validated_data["phone"]
            )


        instance.save(
            update_fields=[
                "phone",
                "updated_at",
            ]
        )


        return instance