from django.shortcuts import get_object_or_404

from rest_framework import (
    generics,
    status,
)
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from permissions.permissions import (
    IsAdmin,
    IsAdminOrEmployee,
)

from customers.models import Customer

from .models import Reward

from .serializers import (
    RewardSerializer,
    RewardRedemptionCreateSerializer,
    RewardRedemptionSerializer,
)

from .services import RewardService


class RewardListCreateView(
    generics.ListCreateAPIView
):

    queryset = (
        Reward.objects
        .all()
        .order_by(
            "points_required"
        )
    )

    serializer_class = (
        RewardSerializer
    )


    def get_permissions(self):

        if self.request.method == "POST":

            permission_classes = [
                IsAdmin
            ]

        else:

            permission_classes = [
                IsAdminOrEmployee
            ]

        return [
            permission()
            for permission
            in permission_classes
        ]


class RewardDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Reward.objects.all()

    serializer_class = (
        RewardSerializer
    )


    def get_permissions(self):

        if self.request.method == "GET":

            permission_classes = [
                IsAdminOrEmployee
            ]

        else:

            permission_classes = [
                IsAdmin
            ]

        return [
            permission()
            for permission
            in permission_classes
        ]


class AvailableCustomerRewardsView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def get(
        self,
        request,
        customer_id
    ):

        customer = get_object_or_404(
            Customer.objects.select_related(
                "user"
            ),
            pk=customer_id
        )


        if (
            request.user.role == "CUSTOMER"
            and customer.user_id
            != request.user.id
        ):
            return Response(
                {
                    "detail": (
                        "No tienes permiso "
                        "para consultar este cliente."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        if (
            request.user.role
            not in [
                "ADMIN",
                "EMPLOYEE",
                "CUSTOMER",
            ]
        ):
            return Response(
                {
                    "detail": (
                        "No tienes permiso "
                        "para realizar esta acción."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        rewards = (
            Reward.objects
            .filter(
                is_active=True,
                points_required__lte=(
                    customer.points
                )
            )
            .order_by(
                "points_required"
            )
        )


        serializer = RewardSerializer(
            rewards,
            many=True
        )


        return Response({
            "customer": {
                "id": customer.id,

                "name": (
                    customer.user
                    .get_full_name()
                ),

                "customer_code": (
                    customer.customer_code
                ),

                "points": (
                    customer.points
                ),
            },

            "rewards": (
                serializer.data
            ),
        })


class RewardRedemptionCreateView(
    APIView
):

    permission_classes = [
        IsAdminOrEmployee
    ]


    def post(
        self,
        request
    ):

        serializer = (
            RewardRedemptionCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )


        customer = get_object_or_404(
            Customer,
            pk=(
                serializer
                .validated_data[
                    "customer"
                ]
            )
        )


        reward = get_object_or_404(
            Reward,
            pk=(
                serializer
                .validated_data[
                    "reward"
                ]
            )
        )


        try:

            redemption = (
                RewardService.redeem_reward(
                    customer=customer,
                    reward=reward,
                    employee=request.user
                )
            )

        except ValueError as e:

            return Response(
                {
                    "detail": str(e)
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )


        response_serializer = (
            RewardRedemptionSerializer(
                redemption
            )
        )


        return Response(
            response_serializer.data,
            status=(
                status
                .HTTP_201_CREATED
            )
        )


class CustomerRewardHistoryView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def get(
        self,
        request,
        customer_code
    ):

        customer = get_object_or_404(
            Customer.objects
            .select_related("user"),
            customer_code=customer_code
        )


        if (
            request.user.role == "CUSTOMER"
            and customer.user_id
            != request.user.id
        ):
            return Response(
                {
                    "detail": (
                        "No tienes permiso "
                        "para consultar este cliente."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        if (
            request.user.role
            not in [
                "ADMIN",
                "EMPLOYEE",
                "CUSTOMER",
            ]
        ):
            return Response(
                {
                    "detail": (
                        "No tienes permiso "
                        "para realizar esta acción."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                )
            )


        redemptions = (
            customer
            .reward_redemptions
            .select_related(
                "reward",
                "employee",
            )
            .order_by(
                "-created_at"
            )
        )


        serializer = (
            RewardRedemptionSerializer(
                redemptions,
                many=True
            )
        )


        return Response({

            "customer": {
                "name": (
                    customer.user
                    .get_full_name()
                ),

                "customer_code": (
                    customer
                    .customer_code
                ),

                "points": (
                    customer.points
                ),
            },

            "redemptions": (
                serializer.data
            ),
        })

class CustomerRewardCatalogView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]


    def get(
        self,
        request
    ):

        if request.user.role != "CUSTOMER":
            return Response(
                {
                    "detail": (
                        "Esta consulta está disponible "
                        "únicamente para clientes."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )


        customer = get_object_or_404(
            Customer.objects.select_related(
                "user"
            ),
            user=request.user
        )


        rewards = (
            Reward.objects
            .filter(
                is_active=True
            )
            .order_by(
                "points_required"
            )
        )


        reward_data = []

        for reward in rewards:

            points_missing = max(
                0,
                reward.points_required
                - customer.points
            )

            reward_data.append({
                "id": reward.id,
                "name": reward.name,
                "description": reward.description,
                "points_required": (
                    reward.points_required
                ),
                "can_redeem": (
                    customer.points
                    >= reward.points_required
                ),
                "points_missing": (
                    points_missing
                ),
            })


        return Response({
            "customer": {
                "id": customer.id,
                "customer_code": (
                    customer.customer_code
                ),
                "points": (
                    customer.points
                ),
            },

            "rewards": reward_data,
        })