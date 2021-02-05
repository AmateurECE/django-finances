from django.shortcuts import render, get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Bank, Account, Fund, Transaction
from django.conf import settings

importClass = lambda class_: \
    getattr(__import__('.'.join(class_.split('.')[:-1]),
                       fromlist=[class_.split('.')[-1]]),
            class_.split('.')[-1]) if isinstance(class_, str) else class_
AUTHENTICATION_CLASSES = [
    importClass(class_)
    for class_ in settings.FINANCES_SETTINGS['DEFAULT_AUTHENTICATION_CLASSES']]
PERMISSION_CLASSES = [
    importClass(class_)
    for class_ in settings.FINANCES_SETTINGS['DEFAULT_PERMISSION_CLASSES']]

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

## Transaction Serializer
class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transaction
        fields = ['url', 'id', 'description', 'amount', 'fund', 'date']

###### ViewSets define the view behavior
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return User.objects.filter(username=self.request.user.username)

class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = PERMISSION_CLASSES

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = PERMISSION_CLASSES
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FundViewSet(viewsets.ModelViewSet):
    serializer_class = FundSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Fund.objects.filter(account__user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Transaction.objects.filter(
            fund__account__user=self.request.user)
