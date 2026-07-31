from django.contrib import admin

from .models import Purchase, PurchaseItem


class PurchaseItemInline(admin.TabularInline):

    model = PurchaseItem

    extra = 1


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer",
        "employee",
        "total_amount",
        "points_earned",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "customer__customer_code",
        "customer__user__email",
        "employee__email",
    )

    inlines = [
        PurchaseItemInline
    ]