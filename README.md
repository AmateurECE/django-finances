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
* Set the API Permissions by adding this code in your `settings.py` file. Any
permission classes can be used, or any strings. The following uses Django
Simple JWT and the built-in Django Session Authentication.
```
FINANCES_SETTINGS = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
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
* Finally, set up the login redirect. When the SPA detects invalid login
credentials, it will reroute the current tab to `/login/`. If there is
currently not a route for that url, add one to your server configuration. For
example, in NGINX:
```
location /login/ {
    # Pass the request up to my auth server
    proxy_pass http://localhost:8000;
}
```
