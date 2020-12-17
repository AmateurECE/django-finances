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

## Bank Serializer
class BankSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bank
        fields = ['url', 'id', 'name']

## Account Serializers
class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = ['url', 'id', 'name', 'bank', 'periodicInterestRate',
                  'accountType']

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
    serializer_class = BankSerializer

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FundViewSet(viewsets.ModelViewSet):
    # TODO: Only get funds for logged in user
    queryset = Fund.objects.all()
    serializer_class = FundSerializer
