from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class PointsProgramSettings(models.Model):
    amount_required = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("50.00"),
        validators=[
            MinValueValidator(
                Decimal("0.01")
            )
        ],
    )

    points_awarded = models.PositiveIntegerField(
        default=1,
        validators=[
            MinValueValidator(1)
        ],
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        verbose_name = (
            "Configuración del programa de puntos"
        )
        verbose_name_plural = (
            "Configuración del programa de puntos"
        )

    def __str__(self):
        return (
            f"{self.points_awarded} punto(s) "
            f"por cada ${self.amount_required}"
        )

    @classmethod
    def get_current(cls):
        settings, _ = (
            cls.objects.get_or_create(
                pk=1,
                defaults={
                    "amount_required": (
                        Decimal("50.00")
                    ),
                    "points_awarded": 1,
                },
            )
        )

        return settings

    def calculate_points(
        self,
        amount,
    ):
        if not amount:
            return 0

        blocks = (
            Decimal(amount)
            // self.amount_required
        )

        return int(
            blocks
            * self.points_awarded
        )