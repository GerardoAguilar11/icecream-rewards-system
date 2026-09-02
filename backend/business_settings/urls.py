from django.urls import path

from .views import (
    PointsProgramSettingsView,
)


urlpatterns = [
    path(
        "points/",
        PointsProgramSettingsView.as_view(),
        name="points-program-settings",
    ),
]