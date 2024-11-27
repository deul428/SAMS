"""AJICT_BMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin


#cci10000(2024-10-07)
#from django.urls import path

from django.urls import include,path


#cci10000(2024-10-07, 2024-10-28)
#urlpatterns = [
#    path("admin/", admin.site.urls),
#]

from .views import f_select1
from .views import f_select2
urlpatterns = [path("polls/",include("polls.urls")),
               path("admin/",admin.site.urls),
               path("select1/",f_select1,name='select1'),
               path("select2/",f_select2,name='select2')]