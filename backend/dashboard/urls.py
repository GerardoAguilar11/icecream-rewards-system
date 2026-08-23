from django.urls import path

from .views import (
    DashboardSummaryView,
    DashboardTopProductsView,
    DashboardSalesLast7DaysView,
)


urlpatterns = [

    path(
        "summary/",
        DashboardSummaryView.as_view(),
        name="dashboard-summary",
    ),

    path(
        "top-products/",
        DashboardTopProductsView.as_view(),
        name="dashboard-top-products",
    ),

    path(
        "sales-last-7-days/",
        DashboardSalesLast7DaysView.as_view(),
        name="dashboard-sales-last-7-days",
    ),
]