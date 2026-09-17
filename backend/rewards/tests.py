from decimal import Decimal

from django.test import TestCase

from rest_framework import serializers

from authentication.models import (
    CustomUser,
    UserRole,
)
from customers.models import Customer
from products.models import Product

from .models import (
    Reward,
    RewardRedemption,
    RewardRedemptionStatus,
    RewardType,
)
from .serializers import RewardSerializer
from .services import RewardService


class RewardSerializerTests(TestCase):

    def setUp(self):

        self.product = Product.objects.create(
            name="Helado 5oz",
            price=Decimal("50.00"),
            is_active=True,
        )

    def test_free_product_from_catalog_is_valid(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Helado gratis",
                "description": (
                    "Helado gratis del catálogo."
                ),
                "points_required": 10,
                "reward_type": (
                    RewardType.FREE_PRODUCT
                ),
                "discount_value": None,
                "product": self.product.id,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_external_free_product_is_valid(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Paleta gratis",
                "description": (
                    "Paleta promocional."
                ),
                "points_required": 15,
                "reward_type": (
                    RewardType.FREE_PRODUCT
                ),
                "discount_value": None,
                "product": None,
                "free_product_name": "Paleta",
                "is_active": True,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_free_product_requires_catalog_product_or_name(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Producto gratis",
                "description": "",
                "points_required": 10,
                "reward_type": (
                    RewardType.FREE_PRODUCT
                ),
                "discount_value": None,
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "free_product_name",
            serializer.errors,
        )

    def test_free_product_cannot_have_product_and_external_name(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Producto gratis",
                "description": "",
                "points_required": 10,
                "reward_type": (
                    RewardType.FREE_PRODUCT
                ),
                "discount_value": None,
                "product": self.product.id,
                "free_product_name": "Paleta",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "free_product_name",
            serializer.errors,
        )

    def test_free_product_cannot_have_discount_value(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Helado gratis",
                "description": "",
                "points_required": 10,
                "reward_type": (
                    RewardType.FREE_PRODUCT
                ),
                "discount_value": "10.00",
                "product": self.product.id,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "discount_value",
            serializer.errors,
        )

    def test_percentage_discount_is_valid(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "10% de descuento",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.PERCENTAGE_DISCOUNT
                ),
                "discount_value": "10.00",
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_percentage_discount_cannot_exceed_100(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Descuento inválido",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.PERCENTAGE_DISCOUNT
                ),
                "discount_value": "101.00",
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "discount_value",
            serializer.errors,
        )

    def test_percentage_discount_must_be_greater_than_zero(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Descuento inválido",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.PERCENTAGE_DISCOUNT
                ),
                "discount_value": "0.00",
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "discount_value",
            serializer.errors,
        )

    def test_percentage_discount_cannot_have_product(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "10% de descuento",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.PERCENTAGE_DISCOUNT
                ),
                "discount_value": "10.00",
                "product": self.product.id,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "product",
            serializer.errors,
        )

    def test_fixed_discount_is_valid(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "$50 de descuento",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.FIXED_DISCOUNT
                ),
                "discount_value": "50.00",
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertTrue(
            serializer.is_valid(),
            serializer.errors,
        )

    def test_fixed_discount_must_be_greater_than_zero(
        self,
    ):

        serializer = RewardSerializer(
            data={
                "name": "Descuento inválido",
                "description": "",
                "points_required": 5,
                "reward_type": (
                    RewardType.FIXED_DISCOUNT
                ),
                "discount_value": "0.00",
                "product": None,
                "free_product_name": "",
                "is_active": True,
            }
        )

        self.assertFalse(
            serializer.is_valid()
        )

        self.assertIn(
            "discount_value",
            serializer.errors,
        )


class RewardServiceTests(TestCase):

    def setUp(self):

        self.employee = (
            CustomUser.objects.create_user(
                email="employee@test.com",
                password="TestPassword123!",
                first_name="Empleado",
                last_name="Prueba",
                role=UserRole.EMPLOYEE,
            )
        )

        self.customer_user = (
            CustomUser.objects.create_user(
                email="customer@test.com",
                password="TestPassword123!",
                first_name="Cliente",
                last_name="Prueba",
                role=UserRole.CUSTOMER,
            )
        )

        self.customer = Customer.objects.create(
            user=self.customer_user,
            points=20,
        )

        self.product = Product.objects.create(
            name="Helado 5oz",
            price=Decimal("50.00"),
            is_active=True,
        )

        self.reward = Reward.objects.create(
            name="Helado gratis",
            description="Helado gratis.",
            points_required=10,
            reward_type=RewardType.FREE_PRODUCT,
            product=self.product,
            free_product_name="",
            is_active=True,
        )

    def test_redeem_reward_deducts_points(
        self,
    ):

        redemption = RewardService.redeem_reward(
            customer=self.customer,
            reward=self.reward,
            employee=self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            10,
        )

        self.assertEqual(
            redemption.points_used,
            10,
        )

        self.assertEqual(
            redemption.customer,
            self.customer,
        )

        self.assertEqual(
            redemption.reward,
            self.reward,
        )

        self.assertEqual(
            redemption.employee,
            self.employee,
        )

        self.assertEqual(
            redemption.status,
            RewardRedemptionStatus.COMPLETED,
        )

    def test_redeem_reward_creates_redemption(
        self,
    ):

        RewardService.redeem_reward(
            customer=self.customer,
            reward=self.reward,
            employee=self.employee,
        )

        self.assertEqual(
            RewardRedemption.objects.count(),
            1,
        )

        redemption = (
            RewardRedemption.objects.get()
        )

        self.assertEqual(
            redemption.points_used,
            self.reward.points_required,
        )

    def test_customer_with_insufficient_points_cannot_redeem(
        self,
    ):

        self.customer.points = 5
        self.customer.save(
            update_fields=[
                "points",
            ]
        )

        with self.assertRaisesRegex(
            ValueError,
            (
                "El cliente no tiene "
                "suficientes puntos."
            ),
        ):
            RewardService.redeem_reward(
                customer=self.customer,
                reward=self.reward,
                employee=self.employee,
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            5,
        )

        self.assertEqual(
            RewardRedemption.objects.count(),
            0,
        )

    def test_inactive_reward_cannot_be_redeemed(
        self,
    ):

        self.reward.is_active = False

        self.reward.save(
            update_fields=[
                "is_active",
            ]
        )

        initial_points = (
            self.customer.points
        )

        with self.assertRaisesRegex(
            ValueError,
            (
                "La recompensa no está "
                "disponible."
            ),
        ):
            RewardService.redeem_reward(
                customer=self.customer,
                reward=self.reward,
                employee=self.employee,
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            initial_points,
        )

        self.assertEqual(
            RewardRedemption.objects.count(),
            0,
        )

    def test_customer_can_redeem_when_points_are_exact(
        self,
    ):

        self.customer.points = 10

        self.customer.save(
            update_fields=[
                "points",
            ]
        )

        redemption = RewardService.redeem_reward(
            customer=self.customer,
            reward=self.reward,
            employee=self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            0,
        )

        self.assertEqual(
            redemption.points_used,
            10,
        )