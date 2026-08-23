from django.urls import path

from .views import (
    RewardListCreateView,
    RewardDetailView,
    RewardRedemptionCreateView,
    CustomerRewardHistoryView,
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
        "<int:pk>/",
        RewardDetailView.as_view(),
        name="reward-detail",
    ),

    path(
        "customer/<str:customer_code>/history/",
        CustomerRewardHistoryView.as_view(),
        name="customer-reward-history",
    ),
]