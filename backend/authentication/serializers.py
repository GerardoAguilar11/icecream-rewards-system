from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers

from customers.models import Customer


User = get_user_model()


class LoginSerializer(
    serializers.Serializer
):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


    def validate(
        self,
        attrs
    ):

        email = attrs.get(
            "email"
        )

        password = attrs.get(
            "password"
        )


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


class UserSerializer(
    serializers.ModelSerializer
):

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


class RegisterSerializer(
    serializers.ModelSerializer
):

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


    def validate_email(
        self,
        value
    ):

        value = value.strip().lower()


        if User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "Ya existe una cuenta con este correo electrónico."
            )


        return value


    @transaction.atomic
    def create(
        self,
        validated_data
    ):

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


class EmployeeSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_active",
            "date_joined",
        ]

        read_only_fields = [
            "id",
            "role",
            "date_joined",
        ]


    def validate_email(
        self,
        value
    ):

        value = value.strip().lower()


        users = User.objects.filter(
            email__iexact=value
        )


        if self.instance:

            users = users.exclude(
                pk=self.instance.pk
            )


        if users.exists():

            raise serializers.ValidationError(
                "Ya existe un usuario con este correo electrónico."
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


class EmployeeCreateSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )


    class Meta:

        model = User

        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "is_active",
        ]

        read_only_fields = [
            "id",
        ]


    def validate_email(
        self,
        value
    ):

        value = value.strip().lower()


        if User.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "Ya existe un usuario con este correo electrónico."
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


    def create(
        self,
        validated_data
    ):

        return User.objects.create_user(
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

            role="EMPLOYEE",

            is_active=validated_data.get(
                "is_active",
                True
            ),
        )