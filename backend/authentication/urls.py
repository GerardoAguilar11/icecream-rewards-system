from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MeView, LogoutView, AdminTestView, RegisterView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("me/", MeView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("admin-test/", AdminTestView.as_view()),
    path("register/",RegisterView.as_view(),name="register"),
]