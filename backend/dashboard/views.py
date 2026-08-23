from django.db.models import Sum, Count, F, DecimalField, ExpressionWrapper
from django.utils import timezone
from django.db.models.functions import TruncDate

from datetime import timedelta

from rest_framework.response import Response
from rest_framework.views import APIView

from permissions.permissions import IsAdmin

from customers.models import Customer
from purchases.models import (
    Purchase,
    PurchaseItem,
    PurchaseStatus,
)
from rewards.models import RewardRedemption, RewardRedemptionStatus


class DashboardSummaryView(APIView):

    permission_classes = [
        IsAdmin
    ]

    def get(self, request):

        today = timezone.localdate()

        completed_purchases_today = Purchase.objects.filter(
            status=PurchaseStatus.COMPLETED,
            created_at__date=today
        )

        sales_today = (
            completed_purchases_today.aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        purchases_today = completed_purchases_today.count()

        customers_count = Customer.objects.count()

        points_issued_today = (
            completed_purchases_today.aggregate(
                total=Sum("points_earned")
            )["total"]
            or 0
        )

        redemptions_today = RewardRedemption.objects.filter(
            status=RewardRedemptionStatus.COMPLETED,
            created_at__date=today
        ).count()

        return Response({
            "sales_today": sales_today,
            "purchases_today": purchases_today,
            "customers": customers_count,
            "points_issued_today": points_issued_today,
            "redemptions_today": redemptions_today,
        })

class DashboardTopProductsView(APIView):

    permission_classes = [
        IsAdmin
    ]

    def get(self, request):

        sales_expression = ExpressionWrapper(
            F("quantity") * F("unit_price"),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2
            )
        )

        top_products = (
            PurchaseItem.objects
            .filter(
                purchase__status=PurchaseStatus.COMPLETED
            )
            .values(
                "product_id",
                "product__name"
            )
            .annotate(
                quantity_sold=Sum("quantity"),
                sales_amount=Sum(sales_expression),
            )
            .order_by("-quantity_sold")[:5]
        )

        data = [
            {
                "product_id": item["product_id"],
                "product_name": item["product__name"],
                "quantity_sold": item["quantity_sold"],
                "sales_amount": item["sales_amount"],
            }
            for item in top_products
        ]

        return Response(data)

class DashboardSalesLast7DaysView(APIView):

    permission_classes = [
        IsAdmin
    ]

    def get(self, request):

        today = timezone.localdate()

        start_date = today - timedelta(days=6)

        sales = (
            Purchase.objects
            .filter(
                status=PurchaseStatus.COMPLETED,
                created_at__date__gte=start_date,
                created_at__date__lte=today,
            )
            .annotate(
                date=TruncDate("created_at")
            )
            .values("date")
            .annotate(
                sales=Sum("total_amount"),
                purchases=Count("id"),
            )
            .order_by("date")
        )

        sales_by_date = {
            item["date"]: {
                "sales": item["sales"],
                "purchases": item["purchases"],
            }
            for item in sales
        }

        data = []

        for day_offset in range(7):

            current_date = (
                start_date
                + timedelta(days=day_offset)
            )

            day_data = sales_by_date.get(
                current_date,
                {
                    "sales": 0,
                    "purchases": 0,
                }
            )

            data.append({
                "date": current_date,
                "sales": day_data["sales"],
                "purchases": day_data["purchases"],
            })

        return Response(data)