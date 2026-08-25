from django.db import models


class ProductCategory(models.TextChoices):

    ICE_CREAM = "ICE_CREAM", "Helado"

    DRINK = "DRINK", "Bebida"

    TOPPING = "TOPPING", "Complemento"

    OTHER = "OTHER", "Otro"


class Product(models.Model):

    name = models.CharField(
        max_length=150
    )

    description = models.TextField(
        blank=True
    )

    category = models.CharField(
        max_length=20,
        choices=ProductCategory.choices,
        default=ProductCategory.ICE_CREAM
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:

        ordering = ["name"]


    def __str__(self):

        return self.name