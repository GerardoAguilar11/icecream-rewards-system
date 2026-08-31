from datetime import timedelta

from django.db.models import (
    Count,
    DecimalField,
    ExpressionWrapper,
    F,
    Sum,
)
from django.db.models.functions import TruncDate
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import CustomUser, UserRole
from customers.models import Customer
from permissions.permissions import IsAdmin
from purchases.models import (
    Purchase,
    PurchaseItem,
    PurchaseStatus,
)
from rewards.models import (
    RewardRedemption,
    RewardRedemptionStatus,
)

from .utils import get_dashboard_date_range


class DashboardSummaryView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request):
        from_date, to_date = get_dashboard_date_range(
            request
        )

        today = timezone.localdate()

        completed_purchases = Purchase.objects.filter(
            status=PurchaseStatus.COMPLETED,
        )

        purchases_in_period = completed_purchases.filter(
            created_at__date__gte=from_date,
            created_at__date__lte=to_date,
        )

        purchases_today = completed_purchases.filter(
            created_at__date=today,
        )

        sales_today = (
            purchases_today.aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        purchases_today_count = (
            purchases_today.count()
        )

        sales_in_period = (
            purchases_in_period.aggregate(
                total=Sum("total_amount")
            )["total"]
            or 0
        )

        purchases_in_period_count = (
            purchases_in_period.count()
        )

        points_issued = (
            purchases_in_period.aggregate(
                total=Sum("points_earned")
            )["total"]
            or 0
        )

        redemptions = RewardRedemption.objects.filter(
            status=RewardRedemptionStatus.COMPLETED,
            created_at__date__gte=from_date,
            created_at__date__lte=to_date,
        )

        redemptions_count = redemptions.count()

        points_redeemed = (
            redemptions.aggregate(
                total=Sum("points_used")
            )["total"]
            or 0
        )

        customers_count = Customer.objects.count()

        active_employees = CustomUser.objects.filter(
            role=UserRole.EMPLOYEE,
            is_active=True,
        ).count()

        return Response({
            "from": from_date,
            "to": to_date,

            "sales_today": sales_today,
            "purchases_today": purchases_today_count,

            "sales_in_period": sales_in_period,
            "purchases_in_period": purchases_in_period_count,

            "customers": customers_count,
            "active_employees": active_employees,

            "points_issued": points_issued,
            "redemptions": redemptions_count,
            "points_redeemed": points_redeemed,
        })


class DashboardSalesTrendView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request):
        from_date, to_date = get_dashboard_date_range(
            request
        )

        sales = (
            Purchase.objects
            .filter(
                status=PurchaseStatus.COMPLETED,
                created_at__date__gte=from_date,
                created_at__date__lte=to_date,
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

        number_of_days = (
            to_date - from_date
        ).days + 1

        data = []

        for day_offset in range(number_of_days):
            current_date = (
                from_date
                + timedelta(days=day_offset)
            )

            day_data = sales_by_date.get(
                current_date,
                {
                    "sales": 0,
                    "purchases": 0,
                },
            )

            data.append({
                "date": current_date,
                "sales": day_data["sales"],
                "purchases": day_data["purchases"],
            })

        return Response(data)


class DashboardTopProductsView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request):
        from_date, to_date = get_dashboard_date_range(
            request
        )

        sales_expression = ExpressionWrapper(
            F("quantity") * F("unit_price"),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )

        top_products = (
            PurchaseItem.objects
            .filter(
                purchase__status=PurchaseStatus.COMPLETED,
                purchase__created_at__date__gte=from_date,
                purchase__created_at__date__lte=to_date,
            )
            .values(
                "product_id",
                "product__name",
            )
            .annotate(
                quantity_sold=Sum("quantity"),
                sales_amount=Sum(sales_expression),
            )
            .order_by(
                "-quantity_sold",
                "-sales_amount",
            )[:5]
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


class DashboardTopCustomersView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request):
        from_date, to_date = get_dashboard_date_range(
            request
        )

        top_customers = (
            Customer.objects
            .filter(
                purchases__status=PurchaseStatus.COMPLETED,
                purchases__created_at__date__gte=from_date,
                purchases__created_at__date__lte=to_date,
            )
            .annotate(
                purchases_count=Count(
                    "purchases",
                    distinct=True,
                ),
                amount_spent=Sum(
                    "purchases__total_amount"
                ),
            )
            .order_by(
                "-amount_spent",
                "-purchases_count",
            )[:5]
        )

        data = [
            {
                "customer_id": customer.id,
                "customer_code": customer.customer_code,
                "name": (
                    f"{customer.user.first_name} "
                    f"{customer.user.last_name}"
                ).strip(),
                "purchases": customer.purchases_count,
                "amount_spent": customer.amount_spent,
                "current_points": customer.points,
            }
            for customer in top_customers
        ]

        return Response(data)


class DashboardTopRewardsView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request):
        from_date, to_date = get_dashboard_date_range(
            request
        )

        top_rewards = (
            RewardRedemption.objects
            .filter(
                status=RewardRedemptionStatus.COMPLETED,
                created_at__date__gte=from_date,
                created_at__date__lte=to_date,
            )
            .values(
                "reward_id",
                "reward__name",
            )
            .annotate(
                redemptions=Count("id"),
                points_used=Sum("points_used"),
            )
            .order_by(
                "-redemptions",
                "-points_used",
            )[:5]
        )

        data = [
            {
                "reward_id": item["reward_id"],
                "reward_name": item["reward__name"],
                "redemptions": item["redemptions"],
                "points_used": item["points_used"],
            }
            for item in top_rewards
        ]

        return Response(data)