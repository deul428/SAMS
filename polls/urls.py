#cci10000(2024-10-07)
from django.urls import path
from . import views
urlpatterns = [path("",views.index,name="index"),]