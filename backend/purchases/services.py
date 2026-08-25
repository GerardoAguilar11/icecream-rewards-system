from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from customers.models import Customer

from rewards.models import (
    RewardRedemption,
    RewardRedemptionStatus,
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
        employee
    ):

        customer_data = data["customer"]

        customer = (
            Customer.objects
            .select_for_update()
            .get(
                pk=customer_data.pk
            )
        )

        items = data["items"]

        reward = data.get(
            "reward"
        )

        total_amount = Decimal(
            "0.00"
        )

        purchase_items = []


        for item in items:

            product = item["product"]

            quantity = item["quantity"]

            subtotal = (
                product.price
                * quantity
            )

            total_amount += subtotal

            purchase_items.append({
                "product": product,
                "quantity": quantity,
                "unit_price": product.price,
                "subtotal": subtotal,
            })


        redemption = None


        if reward:

            redemption = (
                RewardService.redeem_reward(
                    customer=customer,
                    reward=reward,
                    employee=employee
                )
            )

            points = 0

            used_reward = True

        else:

            points = int(
                total_amount // 50
            )

            used_reward = False


        purchase = Purchase.objects.create(
            customer=customer,
            employee=employee,
            redemption=redemption,
            total_amount=total_amount,
            points_earned=points,
            used_reward=used_reward,
        )


        for item in purchase_items:

            PurchaseItem.objects.create(
                purchase=purchase,
                product=item["product"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"],
            )


        if not used_reward:

            customer.points += points

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
        purchase
    ):

        # Bloqueamos solamente la compra.
        # No usamos select_related con redemption porque
        # redemption puede ser NULL.
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
                "La compra ya fue cancelada."
            )


        # Bloqueamos también al cliente para evitar
        # modificaciones simultáneas de puntos.
        customer = (
            Customer.objects
            .select_for_update()
            .get(
                pk=purchase.customer_id
            )
        )


        # Compra que utilizó recompensa.
        if purchase.redemption_id:

            redemption = (
                RewardRedemption.objects
                .select_for_update()
                .get(
                    pk=purchase.redemption_id
                )
            )


            if (
                redemption.status
                ==
                RewardRedemptionStatus.COMPLETED
            ):

                customer.points += (
                    redemption.points_used
                )

                redemption.status = (
                    RewardRedemptionStatus.CANCELLED
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


        # Compra normal.
        else:

            customer.points = max(
                0,
                customer.points
                - purchase.points_earned
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