from django.db import models

from customers.models import Customer
from authentication.models import CustomUser


class Reward(models.Model):

    name = models.CharField(
        max_length=100
    )

    description = models.TextField(
        blank=True
    )

    points_required = models.PositiveIntegerField()

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return f"{self.name} - {self.points_required} puntos"


class RewardRedemptionStatus(models.TextChoices):

    COMPLETED = "COMPLETED", "Completado"

    CANCELLED = "CANCELLED", "Cancelado"


class RewardRedemption(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="reward_redemptions"
    )

    reward = models.ForeignKey(
        Reward,
        on_delete=models.PROTECT,
        related_name="redemptions"
    )

    employee = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name="reward_redemptions_processed"
    )

    points_used = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=RewardRedemptionStatus.choices,
        default=RewardRedemptionStatus.COMPLETED
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    cancelled_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):

        return (
            f"Canje #{self.id} - "
            f"{self.customer} - "
            f"{self.reward}"
        )