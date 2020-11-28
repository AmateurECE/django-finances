from django.contrib import admin
from .models import PaymentSchedule, Bank, Account, Fund, Transaction, \
    NonRecurringTransaction, RecurringTransaction

admin.site.register(PaymentSchedule)
admin.site.register(Bank)
admin.site.register(Account)
admin.site.register(Fund)
admin.site.register(Transaction)
admin.site.register(NonRecurringTransaction)
admin.site.register(RecurringTransaction)
