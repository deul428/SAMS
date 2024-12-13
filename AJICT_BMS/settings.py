"""
Django settings for AJICT_BMS project.
Generated by 'django-admin startproject' using Django 4.1.
For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
from pathlib import Path

from django.conf.global_settings import SESSION_COOKIE_HTTPONLY,SESSION_COOKIE_SECURE

#cci10000(2024-12-12)
#from django.conf.global_settings import SESSION_COOKIE_AGE,SESSION_ENGINE


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-gab36_^a*v$c(!e%_l(%sq=c6xvnq0$%$n75fo8=srep*!_@4r"
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


# cci10000(2024-11-21)
# ALLOWED_HOSTS = []

ALLOWED_HOSTS = ["*"]

# Application definition


# cci10000(2024-10-23, 2024-11-21)
# INSTALLED_APPS = [
#    "django.contrib.admin",
#    "django.contrib.auth",
#    "django.contrib.contenttypes",
#    "django.contrib.sessions",
#    "django.contrib.messages",
#    "django.contrib.staticfiles",
# ]

INSTALLED_APPS = ["django.contrib.admin",
                  "django.contrib.auth",
                  "django.contrib.contenttypes",
                  "django.contrib.sessions",
                  "django.contrib.messages",
                  "django.contrib.staticfiles",
                  "rest_framework",
                  "corsheaders",
                  "AJICT_BMS"]


# cci10000(2024-11-21, 2024-11-29)
# MIDDLEWARE = [
#    "django.middleware.security.SecurityMiddleware",
#    "django.contrib.sessions.middleware.SessionMiddleware",
#    "django.middleware.common.CommonMiddleware",
#    "django.middleware.csrf.CsrfViewMiddleware",
#    "django.contrib.auth.middleware.AuthenticationMiddleware",
#    "django.contrib.messages.middleware.MessageMiddleware",
#    "django.middleware.clickjacking.XFrameOptionsMiddleware",
# ]

MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware",
              "django.middleware.security.SecurityMiddleware",
              "django.contrib.sessions.middleware.SessionMiddleware",
              "django.middleware.common.CommonMiddleware",
              "django.contrib.auth.middleware.AuthenticationMiddleware",
              "django.contrib.messages.middleware.MessageMiddleware",
              "django.middleware.clickjacking.XFrameOptionsMiddleware"]


CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = [
   "DELETE",
   "GET",
   "OPTIONS",
   "PATCH",
   "POST",
   "PUT",
]
CORS_ALLOW_HEADERS = [
   "accept",
   "authorization",
   "content-type",
   "x-csrf-token",
   "x-requested-with",
]
ROOT_URLCONF = "AJICT_BMS.urls"
TEMPLATES = [
   {
      "BACKEND": "django.template.backends.django.DjangoTemplates",
      "DIRS": [],
      "APP_DIRS": True,
      "OPTIONS": {
         "context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
         ],
      },
   },
]
WSGI_APPLICATION = "AJICT_BMS.wsgi.application"
# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases


# cci10000(2024-10-22, 2024-12-09)
# DATABASES = {
#    "default": {
#        "ENGINE": "django.db.backends.sqlite3",
#        "NAME": BASE_DIR / "db.sqlite3",
#    }
# }

DATABASES = {"default": {"ENGINE":"django.db.backends.postgresql",
                         "NAME":"ajict_bms_db",
                         "USER":"ajict_bms_user",
                         "PASSWORD":"ajictcci4",
                         "HOST":"localhost",
                         "PORT":"5432",
                         "CONN_MAX_AGE":6000}}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
   {
      "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
   },
   {
      "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
   },
   {
      "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
   },
   {
      "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
   },
]
# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/
LANGUAGE_CODE = "en-us"


#cci10000(2024-12-12)
#TIME_ZONE = "UTC"

TIME_ZONE = "Asia/Seoul"


USE_I18N = True
USE_TZ = True
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/
STATIC_URL = "static/"
# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# cci10000(2024-12-03)
# 이틀임.
SESSION_COOKIE_AGE = 172800


#cci10000(2024-12-12, 2024-12-13)
#SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = False


SESSION_EXPIRE_AT_BROWSER_CLOSE = True
#CACHE = {'default':{'BACKEND':'django.core.cache.backends.locmem.LocMemCache',
#                    'LOCATION':'unique-sessions'}}

#SESSION_COOKIE_NAME = 'sessionid'