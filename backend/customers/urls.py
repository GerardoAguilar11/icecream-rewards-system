from django.urls import path
from .views import (CustomerListCreateView, CustomerDetailView, CustomerProfileView)


urlpatterns = [
    path("", CustomerListCreateView.as_view()),
    path("me/", CustomerProfileView.as_view()),
    path("<int:pk>/", CustomerDetailView.as_view())
]