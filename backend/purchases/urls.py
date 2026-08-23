from django.urls import path

from .views import (
    PurchaseListCreateView,
    PurchaseDetailView,
    CustomerPurchaseHistoryView,
    PurchaseCancelView,
)


urlpatterns = [
    path("",PurchaseListCreateView.as_view(),name="purchase-list-create",),
    path("<int:pk>/",PurchaseDetailView.as_view(),name="purchase-detail",),
    path("customer/<str:customer_code>/",CustomerPurchaseHistoryView.as_view(),name="customer-history",),
    path("<int:pk>/cancel/",PurchaseCancelView.as_view(),name="purchase-cancel",),
]