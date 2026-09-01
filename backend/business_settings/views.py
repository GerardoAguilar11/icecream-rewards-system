from rest_framework.response import Response
from rest_framework.views import APIView

from permissions.permissions import (
    IsAdmin,
    IsAdminOrEmployee,
)

from .models import PointsProgramSettings
from .serializers import (
    PointsProgramSettingsSerializer,
)


class PointsProgramSettingsView(
    APIView
):

    def get_permissions(
        self,
    ):
        if (
            self.request.method
            == "GET"
        ):
            return [
                IsAdminOrEmployee()
            ]

        return [
            IsAdmin()
        ]

    def get(
        self,
        request,
    ):
        settings = (
            PointsProgramSettings
            .get_current()
        )

        serializer = (
            PointsProgramSettingsSerializer(
                settings
            )
        )

        return Response(
            serializer.data
        )

    def patch(
        self,
        request,
    ):
        settings = (
            PointsProgramSettings
            .get_current()
        )

        serializer = (
            PointsProgramSettingsSerializer(
                settings,
                data=request.data,
                partial=True,
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )