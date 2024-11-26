from django.db import connection
from django.http import HttpResponse
def f_select1(request):
   with connection.cursor() as v_cursor:
      v_cursor.execute("SELECT * FROM PUBLIC.user")
      v_rows = v_cursor.fetchall()
#      return v_rows
      return HttpResponse(v_rows)
#      data = [{"id":row[0],"name":row[1]} for row in v_rows]
#      return HttpResponse({"dataAAAAA":data})
def f_select2(request):
   return HttpResponse("Hello!")