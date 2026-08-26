from django.urls import path

from .views import (
    PurchaseListCreateView,
    PurchaseDetailView,
    CustomerPurchaseHistoryView,
    MyPurchaseListView,
    MyPurchaseDetailView,
    PurchaseCancelView,
)


urlpatterns = [

    path(
        "",
        PurchaseListCreateView.as_view(),
        name="purchase-list-create",
    ),

    path(
        "me/",
        MyPurchaseListView.as_view(),
        name="my-purchase-list",
    ),

    path(
        "me/<int:pk>/",
        MyPurchaseDetailView.as_view(),
        name="my-purchase-detail",
    ),

    path(
        "customer/<str:customer_code>/",
        CustomerPurchaseHistoryView.as_view(),
        name="customer-history",
    ),

    path(
        "<int:pk>/cancel/",
        PurchaseCancelView.as_view(),
        name="purchase-cancel",
    ),

    path(
        "<int:pk>/",
        PurchaseDetailView.as_view(),
        name="purchase-detail",
    ),

]