from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import CreateAPIView

from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from .services import AuthenticationService
from .permissions import IsAdmin


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        data = AuthenticationService.login(user)

        return Response(data, status=status.HTTP_200_OK)
class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(serializer.data)
class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(
                {
                    "message": "Sesión cerrada correctamente"
                },
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
class AdminTestView(APIView):

    permission_classes = [
        IsAdmin
    ]

    def get(self, request):

        return Response(
            {
                "message": "Bienvenido administrador",
                "user": request.user.email
            }
        )
class RegisterView(CreateAPIView):

    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]