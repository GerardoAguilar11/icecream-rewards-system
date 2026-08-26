from django.urls import path

from .views import (
    CustomerListView,
    CustomerDetailView,
    CustomerProfileView,
    CustomerSearchView,
)


urlpatterns = [

    path(
        "",
        CustomerListView.as_view(),
        name="customer-list",
    ),

    path(
        "me/",
        CustomerProfileView.as_view(),
        name="customer-profile",
    ),

    path(
        "search/",
        CustomerSearchView.as_view(),
        name="customer-search",
    ),

    path(
        "<int:pk>/",
        CustomerDetailView.as_view(),
        name="customer-detail",
    ),

]