from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers

from customers.models import Customer


User = get_user_model()


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Correo o contraseña incorrectos."
            )

        attrs["user"] = user

        return attrs


class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "date_joined",
        ]

        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    phone = serializers.CharField(
        required=False,
        allow_blank=True
    )


    class Meta:

        model = User

        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
        ]


    def validate_email(self, value):

        if User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "Ya existe una cuenta con este correo electrónico."
            )

        return value


    @transaction.atomic
    def create(self, validated_data):

        phone = validated_data.pop(
            "phone",
            ""
        )

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get(
                "first_name",
                ""
            ),
            last_name=validated_data.get(
                "last_name",
                ""
            ),
            role="CUSTOMER"
        )

        Customer.objects.create(
            user=user,
            phone=phone
        )

        return user