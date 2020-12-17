from django.urls import path, include
from rest_framework import routers
from . import views

# Routers provide an easy way of automatically determining the URL conf
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'banks', views.BankViewSet, basename='bank')
router.register(r'accounts', views.AccountViewSet, basename='account')
router.register(r'funds', views.FundViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
