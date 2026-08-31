from django.urls import path

from .views import (
    DashboardSalesTrendView,
    DashboardSummaryView,
    DashboardTopCustomersView,
    DashboardTopProductsView,
    DashboardTopRewardsView,
)


urlpatterns = [
    path(
        "summary/",
        DashboardSummaryView.as_view(),
        name="dashboard-summary",
    ),
    path(
        "sales-trend/",
        DashboardSalesTrendView.as_view(),
        name="dashboard-sales-trend",
    ),
    path(
        "top-products/",
        DashboardTopProductsView.as_view(),
        name="dashboard-top-products",
    ),
    path(
        "top-customers/",
        DashboardTopCustomersView.as_view(),
        name="dashboard-top-customers",
    ),
    path(
        "top-rewards/",
        DashboardTopRewardsView.as_view(),
        name="dashboard-top-rewards",
    ),
]