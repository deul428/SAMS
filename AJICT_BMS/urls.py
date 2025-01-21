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
from django.urls import include,path
from .views import f_login,f_logout,f_update_cipher_change
from .views import f_select_biz_opp1,f_select_biz_opp2,f_select_popup_biz_opp,f_insert_biz_opp,f_renewal_biz_opp,f_delete_biz_opp
from .views import f_select_biz_opp_activity1,f_select_biz_opp_activity2,f_select_biz_opp_history
urlpatterns = [path('login/',f_login,name='login'),
               path('logout/',f_logout,name='logout'),
               path('update-cipher-change/',f_update_cipher_change,name='update-cipher-change'),
               path('select-biz-opp1/',f_select_biz_opp1,name='select-biz-opp1'),
               path('select-biz-opp2/',f_select_biz_opp2,name='select-biz-opp2'),
               path('select-popup-biz-opp/',f_select_popup_biz_opp,name='select-popup-biz-opp'),
               path('insert-biz-opp/',f_insert_biz_opp,name='insert-biz-opp'),
               path('renewal-biz-opp/',f_renewal_biz_opp,name='renewal-biz-opp'),
               path('delete-biz-opp/',f_delete_biz_opp,name='delete-biz-opp'),
               path('select-biz-opp-activity1/',f_select_biz_opp_activity1,name='select-biz-opp-activity1'),
               path('select-biz-opp-activity2/',f_select_biz_opp_activity2,name='select-biz-opp-activity2'),
               path('select-biz-opp-history/',f_select_biz_opp_history,name = 'select-biz-opp-history')]