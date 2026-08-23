from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Customer
from .serializers import CustomerSerializer
from permissions.permissions import IsAdminOrEmployee, IsAdmin
from django.db.models import Q

class CustomerListCreateView(
    generics.ListCreateAPIView
):

    queryset = Customer.objects.all()

    serializer_class = CustomerSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]


class CustomerDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Customer.objects.all()

    serializer_class = CustomerSerializer

    permission_classes = [
        IsAdmin
    ]

class CustomerProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        customer = request.user.customer_profile

        serializer = CustomerSerializer(
            customer
        )

        return Response(
            serializer.data
        )
class CustomerSearchView(
    generics.ListAPIView
):

    serializer_class = CustomerSerializer

    permission_classes = [
        IsAdminOrEmployee
    ]

    def get_queryset(self):

        query = self.request.GET.get(
            "q",
            ""
        )

        return Customer.objects.filter(
            Q(customer_code__icontains=query)
            |
            Q(user__first_name__icontains=query)
            |
            Q(user__last_name__icontains=query)
            |
            Q(user__email__icontains=query)
            |
            Q(phone__icontains=query)
        )