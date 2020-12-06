# A Personal Finances Application for Django

This application contains models and views to help a user track their personal
finances. Users can allocate their assets into funds (logical parititions of
their accounts) or generate useful figures and metrics to analyze their
spending habits.

# Installing

* Install using `pip`:
```
pip3 install --index-url https://edtwardy.hopto.org:443/pypi --user \
  django-finances
```
* Add `finances` and `rest_framework` to INSTALLED\_APPS in your project's
`settings.py` file:
```
INSTALLED_APPS = [
    ...
    'finances.apps.FinancesConfig',
    'rest_framework',
    ...
]
```
* Set the API Permissions by adding this code anywhere in your project's
`settings.py` file:
```
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
```
* Patch the application urls into the project's `urls.py` file:
```
urlpatterns = [
    ....
    path('finances/', include('finances.urls')),
    ...
]
```
* Migrate the database:
```
python3 manage.py migrate
```
* Collect the static files:
```
python3 manage.py collectstatic
```
