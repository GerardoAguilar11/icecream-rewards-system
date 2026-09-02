from django.contrib.auth import get_user_model

from rest_framework import (
    generics,
    status,
)

from rest_framework.generics import (
    CreateAPIView,
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import (
    RefreshToken,
)

from .permissions import IsAdmin

from .serializers import (
    EmployeeCreateSerializer,
    EmployeeSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

from .services import AuthenticationService


User = get_user_model()


class LoginView(
    APIView
):

    permission_classes = [
        AllowAny
    ]


    def post(
        self,
        request
    ):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )


        user = serializer.validated_data[
            "user"
        ]


        data = (
            AuthenticationService
            .login(user)
        )


        return Response(
            data,
            status=status.HTTP_200_OK
        )


class MeView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def get(
        self,
        request
    ):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )


class LogoutView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def post(
        self,
        request
    ):

        try:

            refresh_token = (
                request.data["refresh"]
            )

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()


            return Response(
                {
                    "message": (
                        "Sesión cerrada correctamente"
                    )
                },
                status=(
                    status
                    .HTTP_205_RESET_CONTENT
                )
            )

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )


class AdminTestView(
    APIView
):

    permission_classes = [
        IsAdmin
    ]


    def get(
        self,
        request
    ):

        return Response(
            {
                "message": (
                    "Bienvenido administrador"
                ),

                "user": (
                    request.user.email
                )
            }
        )


class RegisterView(
    CreateAPIView
):

    serializer_class = (
        RegisterSerializer
    )

    permission_classes = [
        AllowAny
    ]


class EmployeeListCreateView(
    generics.ListCreateAPIView
):

    permission_classes = [
        IsAdmin
    ]


    def get_queryset(
        self
    ):

        return (
            User.objects
            .filter(
                role="EMPLOYEE"
            )
            .order_by(
                "first_name",
                "last_name",
            )
        )


    def get_serializer_class(
        self
    ):

        if self.request.method == "POST":

            return (
                EmployeeCreateSerializer
            )


        return EmployeeSerializer


class EmployeeDetailView(
    generics.RetrieveUpdateAPIView
):

    permission_classes = [
        IsAdmin
    ]

    serializer_class = (
        EmployeeSerializer
    )


    def get_queryset(
        self
    ):

        return User.objects.filter(
            role="EMPLOYEE"
        )