from django.urls import path

from .views import (PurchaseCreateView,PurchaseListView,PurchaseDetailView,)

urlpatterns = [
    path("",PurchaseListView.as_view(),name="purchase-list",),
    path("create/",PurchaseCreateView.as_view(),name="purchase-create",),
    path("<int:pk>/",PurchaseDetailView.as_view(),name="purchase-detail",),
]