from django.db import migrations
import random


def generate_code(Customer):
    while True:
        code = f"FC{random.randint(1000, 9999)}"

        if not Customer.objects.filter(customer_code=code).exists():
            return code


def populate_customer_codes(apps, schema_editor):

    Customer = apps.get_model("customers", "Customer")

    for customer in Customer.objects.all():

        if not customer.customer_code:
            customer.customer_code = generate_code(Customer)
            customer.save()


class Migration(migrations.Migration):

    dependencies = [
        ("customers", "0002_remove_customer_qr_code_customer_customer_code"),
    ]

    operations = [
        migrations.RunPython(populate_customer_codes),
    ]