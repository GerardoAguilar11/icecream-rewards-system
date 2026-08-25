from django.db import models

from authentication.models import CustomUser
from customers.models import Customer
from products.models import Product


class PurchaseStatus(models.TextChoices):

    COMPLETED = "COMPLETED", "Completada"

    CANCELLED = "CANCELLED", "Cancelada"


class Purchase(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="purchases"
    )

    employee = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name="sales_made"
    )

    redemption = models.OneToOneField(
        "rewards.RewardRedemption",
        on_delete=models.PROTECT,
        related_name="purchase",
        null=True,
        blank=True
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    points_earned = models.PositiveIntegerField(
        default=0
    )

    used_reward = models.BooleanField(
        default=False
    )

    status = models.CharField(
        max_length=20,
        choices=PurchaseStatus.choices,
        default=PurchaseStatus.COMPLETED
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):

        return (
            f"Compra #{self.id} - "
            f"{self.customer}"
        )


    def calculate_points(self):

        if self.used_reward:
            return 0

        return int(
            self.total_amount // 50
        )


class PurchaseItem(models.Model):

    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    def __str__(self):

        return (
            f"{self.product.name} "
            f"x {self.quantity}"
        )