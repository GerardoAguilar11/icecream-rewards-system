from decimal import Decimal

from django.test import TestCase

from authentication.models import (
    CustomUser,
    UserRole,
)
from business_settings.models import (
    PointsProgramSettings,
)
from customers.models import Customer
from products.models import Product
from rewards.models import (
    Reward,
    RewardRedemption,
    RewardRedemptionStatus,
    RewardType,
)

from .models import (
    Purchase,
    PurchaseStatus,
)
from .services import PurchaseService


class PurchaseServiceTests(TestCase):

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

        self.product_90 = Product.objects.create(
            name="Affogato Matcha",
            price=Decimal("90.00"),
            is_active=True,
        )

        self.product_20 = Product.objects.create(
            name="Cono de Helado",
            price=Decimal("20.00"),
            is_active=True,
        )

        self.free_catalog_product = (
            Product.objects.create(
                name="Helado 5oz",
                price=Decimal("50.00"),
                is_active=True,
            )
        )

        PointsProgramSettings.objects.update_or_create(
            pk=1,
            defaults={
                "amount_required": Decimal("20.00"),
                "points_awarded": 1,
            },
        )

        self.catalog_reward = Reward.objects.create(
            name="Helado gratis",
            description=(
                "Producto gratis del catálogo."
            ),
            points_required=10,
            reward_type=RewardType.FREE_PRODUCT,
            product=self.free_catalog_product,
            free_product_name="",
            is_active=True,
        )

        self.external_reward = Reward.objects.create(
            name="Paleta gratis",
            description=(
                "Producto gratis fuera del catálogo."
            ),
            points_required=15,
            reward_type=RewardType.FREE_PRODUCT,
            product=None,
            free_product_name="Paleta",
            is_active=True,
        )

        self.percentage_reward = (
            Reward.objects.create(
                name="10% de descuento",
                description=(
                    "10% de descuento en la compra."
                ),
                points_required=5,
                reward_type=(
                    RewardType.PERCENTAGE_DISCOUNT
                ),
                discount_value=Decimal("10.00"),
                product=None,
                free_product_name="",
                is_active=True,
            )
        )

        self.fixed_reward = Reward.objects.create(
            name="$50 de descuento",
            description=(
                "$50 de descuento en la compra."
            ),
            points_required=5,
            reward_type=RewardType.FIXED_DISCOUNT,
            discount_value=Decimal("50.00"),
            product=None,
            free_product_name="",
            is_active=True,
        )

    def test_normal_purchase_calculates_total_and_points(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "items": [
                    {
                        "product": self.product_90,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("90.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            4,
        )

        self.assertFalse(
            purchase.used_reward
        )

        self.assertEqual(
            self.customer.points,
            24,
        )

        self.assertEqual(
            purchase.items.count(),
            1,
        )

    def test_free_catalog_product_can_be_redeemed_without_items(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.catalog_reward,
                "items": [],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("0.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertTrue(
            purchase.used_reward
        )

        self.assertEqual(
            purchase.items.count(),
            0,
        )

        self.assertEqual(
            self.customer.points,
            10,
        )

        self.assertIsNotNone(
            purchase.redemption
        )

        self.assertEqual(
            purchase.redemption.reward,
            self.catalog_reward,
        )

        self.assertEqual(
            purchase.redemption.points_used,
            10,
        )

    def test_external_free_product_can_be_redeemed_without_items(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.external_reward,
                "items": [],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("0.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertTrue(
            purchase.used_reward
        )

        self.assertEqual(
            self.customer.points,
            5,
        )

        self.assertEqual(
            purchase.redemption.reward.free_product_name,
            "Paleta",
        )

        self.assertIsNone(
            purchase.redemption.reward.product
        )

    def test_percentage_discount_is_applied(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.percentage_reward,
                "items": [
                    {
                        "product": self.product_90,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("81.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertTrue(
            purchase.used_reward
        )

        self.assertEqual(
            self.customer.points,
            15,
        )

        item = purchase.items.get()

        self.assertEqual(
            item.unit_price,
            Decimal("90.00"),
        )

        self.assertEqual(
            item.subtotal,
            Decimal("90.00"),
        )

    def test_fixed_discount_is_applied(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.fixed_reward,
                "items": [
                    {
                        "product": self.product_90,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("40.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertEqual(
            self.customer.points,
            15,
        )

    def test_fixed_discount_never_creates_negative_total(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.fixed_reward,
                "items": [
                    {
                        "product": self.product_20,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("0.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertEqual(
            self.customer.points,
            15,
        )

    def test_percentage_discount_requires_items(
        self,
    ):

        initial_points = self.customer.points

        with self.assertRaisesRegex(
            ValueError,
            (
                "Las recompensas de descuento "
                "requieren al menos un producto "
                "en la compra."
            ),
        ):
            PurchaseService.create_purchase(
                {
                    "customer": self.customer,
                    "reward": self.percentage_reward,
                    "items": [],
                },
                self.employee,
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            initial_points,
        )

        self.assertEqual(
            Purchase.objects.count(),
            0,
        )

        self.assertEqual(
            RewardRedemption.objects.count(),
            0,
        )

    def test_fixed_discount_requires_items(
        self,
    ):

        initial_points = self.customer.points

        with self.assertRaisesRegex(
            ValueError,
            (
                "Las recompensas de descuento "
                "requieren al menos un producto "
                "en la compra."
            ),
        ):
            PurchaseService.create_purchase(
                {
                    "customer": self.customer,
                    "reward": self.fixed_reward,
                    "items": [],
                },
                self.employee,
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            initial_points,
        )

        self.assertEqual(
            Purchase.objects.count(),
            0,
        )

        self.assertEqual(
            RewardRedemption.objects.count(),
            0,
        )

    def test_empty_purchase_without_reward_is_rejected(
        self,
    ):

        initial_points = self.customer.points

        with self.assertRaisesRegex(
            ValueError,
            (
                "Agrega al menos un producto "
                "o selecciona una recompensa."
            ),
        ):
            PurchaseService.create_purchase(
                {
                    "customer": self.customer,
                    "items": [],
                },
                self.employee,
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            initial_points,
        )

        self.assertEqual(
            Purchase.objects.count(),
            0,
        )

    def test_reward_purchase_does_not_generate_points(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.percentage_reward,
                "items": [
                    {
                        "product": self.product_90,
                        "quantity": 2,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            purchase.total_amount,
            Decimal("162.00"),
        )

        self.assertEqual(
            purchase.points_earned,
            0,
        )

        self.assertEqual(
            self.customer.points,
            15,
        )

    def test_cancel_normal_purchase_removes_earned_points(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "items": [
                    {
                        "product": self.product_90,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            24,
        )

        cancelled_purchase = (
            PurchaseService.cancel_purchase(
                purchase
            )
        )

        self.customer.refresh_from_db()
        cancelled_purchase.refresh_from_db()

        self.assertEqual(
            cancelled_purchase.status,
            PurchaseStatus.CANCELLED,
        )

        self.assertEqual(
            self.customer.points,
            20,
        )

    def test_cancel_reward_purchase_restores_points_and_cancels_redemption(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "reward": self.catalog_reward,
                "items": [],
            },
            self.employee,
        )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            10,
        )

        redemption_id = (
            purchase.redemption_id
        )

        cancelled_purchase = (
            PurchaseService.cancel_purchase(
                purchase
            )
        )

        self.customer.refresh_from_db()

        redemption = (
            RewardRedemption.objects.get(
                pk=redemption_id
            )
        )

        self.assertEqual(
            cancelled_purchase.status,
            PurchaseStatus.CANCELLED,
        )

        self.assertEqual(
            self.customer.points,
            20,
        )

        self.assertEqual(
            redemption.status,
            RewardRedemptionStatus.CANCELLED,
        )

        self.assertIsNotNone(
            redemption.cancelled_at
        )

    def test_cancel_purchase_twice_is_rejected(
        self,
    ):

        purchase = PurchaseService.create_purchase(
            {
                "customer": self.customer,
                "items": [
                    {
                        "product": self.product_20,
                        "quantity": 1,
                    }
                ],
            },
            self.employee,
        )

        PurchaseService.cancel_purchase(
            purchase
        )

        self.customer.refresh_from_db()

        points_after_first_cancel = (
            self.customer.points
        )

        with self.assertRaisesRegex(
            ValueError,
            "La compra ya fue cancelada.",
        ):
            PurchaseService.cancel_purchase(
                purchase
            )

        self.customer.refresh_from_db()

        self.assertEqual(
            self.customer.points,
            points_after_first_cancel,
        )