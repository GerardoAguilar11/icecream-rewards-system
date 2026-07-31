from django.db import models
from authentication.models import CustomUser
from .utils import generate_customer_code

class Customer(models.Model):

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="customer_profile"
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    customer_code = models.CharField(
        max_length=6,
        unique=True,
        editable=False,
    )

    points = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.customer_code:

            self.customer_code = generate_customer_code()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer_code} - {self.user.first_name} {self.user.last_name}"