from decimal import Decimal

from django.db import transaction

from customers.models import Customer
from products.models import Product

from .models import Purchase, PurchaseItem


class PurchaseService:

    @staticmethod
    @transaction.atomic
    def create_purchase(data, employee):

        customer = Customer.objects.get(
            id=data["customer"]
        )

        items = data["items"]

        total_amount = Decimal("0.00")

        purchase_items = []

        for item in items:

            product = Product.objects.get(
                id=item["product"]
            )

            quantity = item["quantity"]

            subtotal = product.price * quantity

            total_amount += subtotal

            purchase_items.append({
                "product": product,
                "quantity": quantity,
                "unit_price": product.price,
                "subtotal": subtotal,
            })

        points = int(total_amount // 50)

        purchase = Purchase.objects.create(
            customer=customer,
            employee=employee,
            total_amount=total_amount,
            points_earned=points,
        )

        for item in purchase_items:

            PurchaseItem.objects.create(
                purchase=purchase,
                product=item["product"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"],
            )

        customer.points += points
        customer.save()

        return purchase

        if not purchase_items:
            raise ValueError("La compra debe contener al menos un producto.")