#cci10000(2024-10-07)
#from django.shortcuts import render

# Create your views here.


#cci10000(2024-10-07)
from django.http import HttpResponse
def index(request):
   return HttpResponse("한글도 잘 되나?")