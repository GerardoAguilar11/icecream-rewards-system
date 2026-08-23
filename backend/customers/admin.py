from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):

    list_display = (
        "customer_code",
        "customer_name",
        "phone",
        "points",
        "created_at",
    )

    search_fields = (
        "customer_code",
        "user__first_name",
        "user__last_name",
        "user__email",
        "phone",
    )

    list_filter = (
        "created_at",
    )

    def get_email(self, obj):

        return obj.user.email

    get_email.short_description = "Email"

    def customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    customer_name.short_description = "Nombre"