from rest_framework import authentication

class CsrfExemptSessionAuthentication(authentication.BaseAuthentication):
    def has_permission(self, request, view, obj=None):
        return True

    def has_object_permission(self, request, view, obj=None):
        return True
