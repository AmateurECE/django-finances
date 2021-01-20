from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, date

class Bank(models.Model):
    name = models.CharField(max_length=80)

    def __str__(self):
        return self.name

class Account(models.Model):
    name = models.CharField(max_length=80)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    periodicInterestRate = models.FloatField(
        help_text=("The interest rate per period, in percent (NOTE: This is "
                   "neither APY nor APR)"))
    accountType = models.CharField(
        max_length=20,
        choices=[
            ('SAVINGS', 'Savings'),
            ('CHECKING', 'Checking'),
        ])

    def __str__(self):
        return '{} ({}, {})'.format(
            self.name, self.bank.name, self.accountType)

class Fund(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    description = models.CharField(max_length=80, blank=True, null=True)
    target = models.FloatField(blank=True, null=True)
    # TODO: Interest--not factored, factored proportionally, remaining (unique)

    def __str__(self):
        return self.description

class Transaction(models.Model):
    description = models.CharField(max_length=80)
    amount = models.FloatField()
    fund = models.ForeignKey(Fund, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)

    def __str__(self):
        return self.description

# TODO: ScheduledPayment Model
