from rest_framework import serializers

from .models import PointsProgramSettings


class PointsProgramSettingsSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = PointsProgramSettings

        fields = [
            "id",
            "amount_required",
            "points_awarded",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "updated_at",
        ]

    def validate_amount_required(
        self,
        value,
    ):
        if value <= 0:
            raise serializers.ValidationError(
                "El monto requerido debe ser "
                "mayor a cero."
            )

        return value

    def validate_points_awarded(
        self,
        value,
    ):
        if value <= 0:
            raise serializers.ValidationError(
                "Los puntos otorgados deben ser "
                "mayores a cero."
            )

        return value