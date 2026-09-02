from datetime import timedelta

from django.utils import timezone
from rest_framework.exceptions import ValidationError


def get_dashboard_date_range(request):
    today = timezone.localdate()

    from_param = request.query_params.get("from")
    to_param = request.query_params.get("to")

    if not from_param and not to_param:
        return today - timedelta(days=6), today

    if not from_param or not to_param:
        raise ValidationError({
            "detail": (
                "Debes proporcionar tanto 'from' como 'to'."
            )
        })

    try:
        from_date = timezone.datetime.strptime(
            from_param,
            "%Y-%m-%d",
        ).date()

        to_date = timezone.datetime.strptime(
            to_param,
            "%Y-%m-%d",
        ).date()

    except ValueError:
        raise ValidationError({
            "detail": (
                "Las fechas deben tener el formato YYYY-MM-DD."
            )
        })

    if from_date > to_date:
        raise ValidationError({
            "detail": (
                "La fecha inicial no puede ser posterior "
                "a la fecha final."
            )
        })

    if to_date > today:
        raise ValidationError({
            "detail": (
                "La fecha final no puede ser posterior "
                "a la fecha actual."
            )
        })

    return from_date, to_date