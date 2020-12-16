from django.shortcuts import render, get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Bank, Account, Fund

##### Serializers define the API representation
## User Serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name', 'last_name', 'email',
                  'last_login', 'date_joined', 'account_set']

## Bank Serializers
class BankListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bank
        fields = ['url', 'id', 'name']

class BankDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bank
        fields = ['url', 'id', 'name', 'address', 'routingNumber']

## Account Serializers
class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = ['url', 'id', 'name', 'user', 'bank', 'periodicInterestRate',
                  'number', 'accountType', 'fund_set']

## Fund Serializer
class FundSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Fund
        fields = ['url', 'id', 'account', 'description', 'target']

###### ViewSets define the view behavior
class UserViewSet(viewsets.ModelViewSet):
    # TODO: Only get logged in user
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankDetailSerializer

    def list(self, request):
        queryset = Bank.objects.all()
        serializer = BankListSerializer(
            queryset, many=True, context={'request': request})
        return Response(serializer.data)

class AccountViewSet(viewsets.ModelViewSet):
    # TODO: Only get accounts for logged in user
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class FundViewSet(viewsets.ModelViewSet):
    # TODO: Only get funds for logged in user
    queryset = Fund.objects.all()
    serializer_class = FundSerializer
