from django.contrib import admin
from .models import Bank, Account, Fund, Transaction

admin.site.register(Bank)
admin.site.register(Account)
admin.site.register(Fund)
admin.site.register(Transaction)
