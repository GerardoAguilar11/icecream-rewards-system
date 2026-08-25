from django.urls import path

from .views import (
    RewardListCreateView,
    RewardDetailView,
    RewardRedemptionCreateView,
    CustomerRewardHistoryView,
    AvailableCustomerRewardsView,
)


urlpatterns = [

    path(
        "",
        RewardListCreateView.as_view(),
        name="reward-list-create",
    ),

    path(
        "redeem/",
        RewardRedemptionCreateView.as_view(),
        name="reward-redeem",
    ),

    path(
        "customer/<int:customer_id>/available/",
        AvailableCustomerRewardsView.as_view(),
        name="customer-available-rewards",
    ),

    path(
        "customer/<str:customer_code>/history/",
        CustomerRewardHistoryView.as_view(),
        name="customer-reward-history",
    ),

    path(
        "<int:pk>/",
        RewardDetailView.as_view(),
        name="reward-detail",
    ),
]