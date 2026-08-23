from django.db import transaction

from customers.models import Customer

from .models import (
    Reward,
    RewardRedemption,
    RewardRedemptionStatus,
)


class RewardService:

    @staticmethod
    @transaction.atomic
    def redeem_reward(customer, reward, employee):

        if not reward.is_active:
            raise ValueError(
                "La recompensa no está disponible."
            )

        if customer.points < reward.points_required:
            raise ValueError(
                "El cliente no tiene suficientes puntos."
            )

        points_used = reward.points_required

        customer.points -= points_used
        customer.save(
            update_fields=["points"]
        )

        redemption = RewardRedemption.objects.create(
            customer=customer,
            reward=reward,
            employee=employee,
            points_used=points_used,
            status=RewardRedemptionStatus.COMPLETED,
        )

        return redemption