from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from .models import Bank, Account, Fund

# Serializers define the API representation
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email',
                  'last_login', 'date_joined', 'account_set']

class BankSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bank
        fields = ['name', 'address', 'routingNumber']

class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = ['name', 'user', 'bank', 'periodicInterestRate', 'number',
                  'accountType', 'fund_set']

class FundSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Fund
        fields = ['account', 'description', 'target']

# ViewSets define the view behavior
class UserViewSet(viewsets.ModelViewSet):
    # TODO: Only get logged in user
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

class AccountViewSet(viewsets.ModelViewSet):
    # TODO: Only get accounts for logged in user
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class FundViewSet(viewsets.ModelViewSet):
    # TODO: Only get funds for logged in user
    queryset = Fund.objects.all()
    serializer_class = FundSerializer

# Routers provide an easy way of automatically determining the URL conf
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'banks', BankViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'funds', FundViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
