import random

from django.apps import apps


def generate_customer_code():

    Customer = apps.get_model(
        "customers",
        "Customer"
    )

    while True:

        code = f"FC{random.randint(1000,9999)}"

        if not Customer.objects.filter(
            customer_code=code
        ).exists():

            return code