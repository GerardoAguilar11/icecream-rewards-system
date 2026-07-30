from rest_framework_simplejwt.tokens import RefreshToken

class AuthenticationService:

    @staticmethod
    def login(user):
        """ Genera los tokens JWT para un usuario autenticado."""

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }