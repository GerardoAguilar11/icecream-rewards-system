from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Administrador"
    EMPLOYEE = "EMPLOYEE", "Empleado"
    CUSTOMER = "CUSTOMER", "Cliente"


class CustomUser(AbstractUser):
    username = None

    email = models.EmailField(
        unique=True,
        verbose_name="Correo electrónico"
    )

    role = models.CharField(
        verbose_name="Rol",
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"