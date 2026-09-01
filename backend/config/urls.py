"""
URL configuration for config project.

The urlpatterns list routes URLs to views.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/health/", health_check, name="health-check"),

    path("api/auth/", include("authentication.urls")),
    path("api/customers/", include("customers.urls")),
    path("api/products/", include("products.urls")),
    path("api/purchases/", include("purchases.urls")),
    path("api/rewards/", include("rewards.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )