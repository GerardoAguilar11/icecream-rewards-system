from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "get_email",
        "points",
        "qr_code",
        "created_at",
    )


    def get_email(self, obj):

        return obj.user.email

    get_email.short_description = "Email"