from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from business_settings.models import (
    PointsProgramSettings,
)
from customers.models import Customer
from rewards.models import (
    RewardRedemption,
    RewardRedemptionStatus,
    RewardType,
)
from rewards.services import RewardService

from .models import (
    Purchase,
    PurchaseItem,
    PurchaseStatus,
)


class PurchaseService:

    @staticmethod
    @transaction.atomic
    def create_purchase(
        data,
        employee,
    ):
        customer_data = (
            data["customer"]
        )

        customer = (
            Customer.objects
            .select_for_update()
            .get(
                pk=customer_data.pk
            )
        )

        items = data.get(
            "items",
            []
        )

        reward = data.get(
            "reward"
        )

        if (
            not items
            and not reward
        ):
            raise ValueError(
                "Agrega al menos un producto "
                "o selecciona una recompensa."
            )

        if (
            not items
            and reward
            and reward.reward_type
            != RewardType.FREE_PRODUCT
        ):
            raise ValueError(
                "Las recompensas de descuento "
                "requieren al menos un producto "
                "en la compra."
            )

        subtotal_amount = Decimal(
            "0.00"
        )

        purchase_items = []

        for item in items:
            product = item[
                "product"
            ]

            quantity = item[
                "quantity"
            ]

            subtotal = (
                product.price
                * quantity
            )

            subtotal_amount += (
                subtotal
            )

            purchase_items.append({
                "product": product,
                "quantity": quantity,
                "unit_price": (
                    product.price
                ),
                "subtotal": subtotal,
            })

        total_amount = (
            subtotal_amount
        )

        redemption = None
        used_reward = False

        if reward:
            redemption = (
                RewardService
                .redeem_reward(
                    customer=customer,
                    reward=reward,
                    employee=employee,
                )
            )

            used_reward = True

            if (
                reward.reward_type
                ==
                RewardType.PERCENTAGE_DISCOUNT
            ):
                discount_percentage = (
                    reward.discount_value
                )

                discount_amount = (
                    subtotal_amount
                    * discount_percentage
                    / Decimal("100")
                )

                total_amount = (
                    subtotal_amount
                    - discount_amount
                )

            elif (
                reward.reward_type
                ==
                RewardType.FIXED_DISCOUNT
            ):
                discount_amount = (
                    reward.discount_value
                )

                total_amount = max(
                    Decimal("0.00"),
                    subtotal_amount
                    - discount_amount,
                )

            elif (
                reward.reward_type
                ==
                RewardType.FREE_PRODUCT
            ):
                total_amount = (
                    subtotal_amount
                )

        total_amount = (
            total_amount.quantize(
                Decimal("0.01")
            )
        )

        if used_reward:
            points = 0

        else:
            points_settings = (
                PointsProgramSettings
                .get_current()
            )

            points = (
                points_settings
                .calculate_points(
                    total_amount
                )
            )

        purchase = (
            Purchase.objects.create(
                customer=customer,
                employee=employee,
                redemption=redemption,
                total_amount=(
                    total_amount
                ),
                points_earned=points,
                used_reward=(
                    used_reward
                ),
            )
        )

        for item in purchase_items:
            PurchaseItem.objects.create(
                purchase=purchase,
                product=(
                    item["product"]
                ),
                quantity=(
                    item["quantity"]
                ),
                unit_price=(
                    item["unit_price"]
                ),
                subtotal=(
                    item["subtotal"]
                ),
            )

        if not used_reward:
            customer.points += (
                points
            )

            customer.save(
                update_fields=[
                    "points",
                    "updated_at",
                ]
            )

        return purchase

    @staticmethod
    @transaction.atomic
    def cancel_purchase(
        purchase,
    ):
        purchase = (
            Purchase.objects
            .select_for_update()
            .get(
                pk=purchase.pk
            )
        )

        if (
            purchase.status
            == PurchaseStatus.CANCELLED
        ):
            raise ValueError(
                "La compra ya fue "
                "cancelada."
            )

        customer = (
            Customer.objects
            .select_for_update()
            .get(
                pk=(
                    purchase
                    .customer_id
                )
            )
        )

        if purchase.redemption_id:
            redemption = (
                RewardRedemption.objects
                .select_for_update()
                .get(
                    pk=(
                        purchase
                        .redemption_id
                    )
                )
            )

            if (
                redemption.status
                ==
                RewardRedemptionStatus
                .COMPLETED
            ):
                customer.points += (
                    redemption
                    .points_used
                )

                redemption.status = (
                    RewardRedemptionStatus
                    .CANCELLED
                )

                redemption.cancelled_at = (
                    timezone.now()
                )

                redemption.save(
                    update_fields=[
                        "status",
                        "cancelled_at",
                    ]
                )

        else:
            customer.points = max(
                0,
                customer.points
                - purchase.points_earned,
            )

        customer.save(
            update_fields=[
                "points",
                "updated_at",
            ]
        )

        purchase.status = (
            PurchaseStatus.CANCELLED
        )

        purchase.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return purchase