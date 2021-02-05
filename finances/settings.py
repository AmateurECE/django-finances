###############################################################################
# NAME:             settings.py
#
# AUTHOR:           Ethan D. Twardy <edtwardy@mtu.edu>
#
# DESCRIPTION:      Default settings for the django-finances app
#
# CREATED:          02/04/2021
#
# LAST EDITED:      02/04/2021
###

from django.conf import settings

DEFAULT_SETTINGS = {
    'DEFAULT_PERMISSION_CLASSES': [],
    'DEFAULT_AUTHENTICATION_CLASSES': []
}

settings.FINANCES_SETTINGS = getattr(
    settings, 'FINANCES_SETTINGS', DEFAULT_SETTINGS)
settings.FINANCES_SETTINGS['DEFAULT_PERMISSION_CLASSES'] = getattr(
    settings.FINANCES_SETTINGS, 'DEFAULT_PERMISSION_CLASSES',
    DEFAULT_SETTINGS['DEFAULT_PERMISSION_CLASSES']
)

settings.FINANCES_SETTINGS['DEFAULT_AUTHENTICATION_CLASSES'] = getattr(
    settings.FINANCES_SETTINGS, 'DEFAULT_AUTHENTICATION_CLASSES',
    DEFAULT_SETTINGS['DEFAULT_AUTHENTICATION_CLASSES']
)

###############################################################################
