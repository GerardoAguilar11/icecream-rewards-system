from django.urls import path
from .views import (CustomerListView, CustomerDetailView, CustomerProfileView, CustomerSearchView)


urlpatterns = [
    path("", CustomerListView.as_view()),
    path("me/", CustomerProfileView.as_view()),
    path("<int:pk>/", CustomerDetailView.as_view()),
    path("search/",CustomerSearchView.as_view(),name="customer-search"),
]