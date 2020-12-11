from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class PaymentSchedule(models.Model):
    # TODO: Come up with a better BNF Grammar
    # paymentSchedule := Every <_ordinal> <period> [and <_ordinal> <period>]
    #                    starting on <_date>
    # period := day,sunday-saturday,week,
    schedule = models.CharField(max_length=200)
    startDate = models.DateField()
    duration = models.DurationField()
    isForever = models.BooleanField()
    transaction = models.OneToOneField(
        'RecurringTransaction', on_delete=models.CASCADE)

    def clean(self):
        """Validate the schedule against our BNF grammar."""
        # TODO: PaymentSchedule.clean

    def __str__(self):
        return self.schedule

class Bank(models.Model):
    name = models.CharField(max_length=80)
    address = models.CharField(max_length=200)
    routingNumber = models.CharField(max_length=80)

    def __str__(self):
        return self.name

class Account(models.Model):
    name = models.CharField(max_length=80)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    periodicInterestRate = models.FloatField(
        help_text=("The interest rate per period, in percent (NOTE: This is "
                   "neither APY nor APR)"))
    # TODO: Allow number to be null?
    number = models.CharField(max_length=80)
    accountType = models.CharField(
        max_length=80,
        choices=[
            ('SAVINGS', 'Savings'),
            ('CHECKING', 'Checking'),
        ])

    def __str__(self):
        return '{} ({}, Acct: ***{})'.format(
            self.name, self.bank.name, self.number[-4:])

class Fund(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    description = models.CharField(max_length=80)
    target = models.IntegerField(blank=True, null=True)
    # TODO: Interest--not factored, factored proportionally, remaining (unique)

    def __str__(self):
        return self.description

class Transaction(models.Model):
    description = models.CharField(max_length=80)
    amount = models.FloatField()
    fund = models.ForeignKey(Fund, on_delete=models.CASCADE)

    def __str__(self):
        return self.description

class NonRecurringTransaction(Transaction):
    date = models.DateField(default=datetime.now)

class RecurringTransaction(Transaction):
    pass
