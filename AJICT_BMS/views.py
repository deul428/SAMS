import logging
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.db import connection
from django.http import HttpResponse,JsonResponse
from datetime import datetime
logging.basicConfig(level=logging.DEBUG)
def f_login(request):
   v_user_id = ""
   v_cipher = ""
   #if request.method == "POST":
   #   v_user_id = request.POST.get("a_user_id")
   #   v_cipher = request.POST.get("a_cipher")
   v_user_id = "leecj"
   v_cipher = "123456777ㅁㅁㅁㅁ"
   try:
      #v_data = json.loads(request.body)
      v_sql1 = """SELECT COUNT(*) AS count FROM ajict_bms_schema.aj_user WHERE user_id = %s"""
      v_param1 = []
      v_param1.append(v_user_id)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql1,v_param1)
         v_row1 = v_cursor.fetchone()
         v_count1 = v_row1[0]
         if v_count1 == 0:
            v_data1 = {"STATUS":"FAIL","MESSAGE":"존재하지 않는 사용자 ID입니다."}
            return JsonResponse(v_data1,safe=False,json_dumps_params={'ensure_ascii':False})
      v_sql2 = """SELECT COUNT(*) AS count FROM ajict_bms_schema.aj_user WHERE user_id = %s AND cipher = %s"""
      v_param2=[]
      v_param2.append(v_user_id)
      v_param2.append(v_cipher)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql2,v_param2)
         v_row2 = v_cursor.fetchone()
         v_count2 = v_row2[0]
         if v_count2 == 0:
            v_data2 = {"STATUS":"FAIL","MESSAGE":"비밀번호가 틀립니다."}
            return JsonResponse(v_data2,safe=False,json_dumps_params={'ensure_ascii':False})
      v_sql3 = """SELECT user_id,
                         user_name,
                         cipher,
                         dept_id,
                         position1_code,
                         position2_code,
                         responsibility1_code,
                         responsibility2_code,
                         auth1_code,
                         auth2_code,
                         beginning_login_tf,
                         create_user,
                         create_date,
                         update_user,
                         update_date,
                         delete_user,
                         delete_date
                  FROM ajict_bms_schema.aj_user
                  WHERE user_id = %s AND
                        cipher = %s"""
      v_param3 = []
      v_param3.append(v_user_id)
      v_param3.append(v_cipher)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql3,v_param3)
         v_columns = [v_column[0] for v_column in v_cursor.description]
         v_rows = v_cursor.fetchall()
         v_data3 = [dict(zip(v_columns,row)) for row in v_rows]
         v_session = [f_serialize(row,v_columns) for row in v_rows]
         request.session['v_global_data'] = v_session
         #logging.debug(f"request.session.get : {request.session.get('v_global_data',[])}")
         v_additional_info = {"STATUS": "SUCCESS","MESSAGE": "login 되었습니다."}
         v_data3.append(v_additional_info)
         return JsonResponse(v_data3,safe=False,json_dumps_params={'ensure_ascii':False})
   except json.JSONDecodeError:
      v_return = {"STATUS":"JSON","MESSAGE":"JSON의 format가 틀립니다."}
      return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
def f_serialize(a_row,a_columns):
   v_row_dict = {}
   for v_column,v_value in zip(a_columns,a_row):
      if isinstance(v_value,datetime):
         v_row_dict[v_column] = v_value.isoformat()
      else:
         v_row_dict[v_column] = v_value
def f_cipher_change(request):
   #if request.method == "POST":
      v_old_cipher = request.POST.get('a_old_cipher')
      v_new_cipher = request.POST.get('a_new_cipher')
      #v_old_cipher = "12345"
      #v_new_cipher = "123456777"
      v_global_data = request.session.get('v_global_data',[])
      #v_user_id = [item['user_id'] for item in v_global_data if 'user_id' in item]
      v_user_id = "leecj"
      if v_old_cipher == v_new_cipher:
         v_return = {"STATUS":"FAIL","MESSAGE":"이전 비밀번호와 같습니다. 다르게 설정해주십시오."}
         return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
      if len(v_new_cipher) < 5:
         v_return = {"STATUS":"FAIL","MESSAGE":"비밀번호는 최소 5자리 이상이어야 합니다."}
         return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
      try:
         with transaction.atomic():
            v_sql = """UPDATE ajict_bms_schema.aj_user SET cipher = %s,beginning_login_tf = FALSE WHERE user_id = %s"""
            v_param=[]
            v_param.append(v_new_cipher)
            v_param.append(v_user_id)
            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql,v_param)
               v_return = {"STATUS":"SUCCESS","MESSAGE":"저잗되었습니다."}
               return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
      except Exception as E:
         v_return = {"STATUS":"FAIL","MESSAGE":"DB의 문제로 인해 비밀번호를 변경하지 못했습니다.","ERROR":str(E)}
         return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
def f_logout(request):
   request.session.flush()
   #logging.debug(f"request.session.get : {request.session.get('v_global_data',[])}")
   v_return = {"STATUS":"SUCCESS","MESSAGE":"logout 되었습니다."}
   return JsonResponse(v_return,safe=False,json_dumps_params={'ensure_ascii':False})
def f_select_biz_opp1(request):
   #if request.method == "POST":
      try:
         #v_progress_rate_code_from = request.POST.get('a_progress_rate_code_from')
         #v_progress_rate_code_to = request.POST.get('a_progress_rate_code_to')
      #v_user_id = request.POST.get('a_user_id')
      #v_cipher = request.POST.get('a_cipher')
      # v_progress_rate_from = request.POST.get('a_progress_rate_from')
      # v_progress_rate_to = request.POST.get('a_progress_rate_to')
      # v_contract_date_from = request.POST.get('a_contract_date_from')
      # v_contract_date_to = request.POST.get('a_contract_date_to')
      # v_sale_date_from = request.POST.get('a_sale_date_from')
      # v_sale_date_to = request.POST.get('a_sale_date_to')
      # v_essential_achievement_tf = request.POST.get('a_essential_achievement_tf')
         v_progress_rate_code_from = '0001'
         v_progress_rate_code_to = '0006'
         v_sql = """SELECT biz_opp_id,
                           biz_opp_name,
                           user_id,
                           (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = A.user_id) AS user_name,
                           change_preparation_dept_id,
                           change_preparation_dept_name,
                           last_client_com1_code,
                           last_client_com2_code,
                           (SELECT DISTINCT BB.great_classi_name
                            FROM ajict_bms_schema.commonness_code BB
                            WHERE BB.great_classi_code = A.last_client_com1_code) AS last_client_com1_name,
                           (SELECT CC.small_classi_name
                            FROM ajict_bms_schema.commonness_code CC
                            WHERE CC.great_classi_code = A.last_client_com1_code AND
                                  CC.small_classi_code = A.last_client_com2_code) AS last_client_com2_name,
                           sale_com1_code,
                           sale_com2_code,
                           (SELECT DISTINCT DD.great_classi_name
                            FROM ajict_bms_schema.commonness_code DD
                            WHERE DD.great_classi_code = A.sale_com1_code) AS sale_com1_name,
                           (SELECT EE.small_classi_name
                            FROM ajict_bms_schema.commonness_code EE
                            WHERE EE.great_classi_code = A.sale_com1_code AND
                                  EE.small_classi_code = A.sale_com2_code) AS sale_com2_name,
                           contract_date,
                           progress1_rate_code,
                           progress2_rate_code,
                          (SELECT DISTINCT NN.great_classi_name
                           FROM ajict_bms_schema.commonness_code NN
                           WHERE NN.great_classi_code = A.progress1_rate_code) AS progress1_rate_name,
                          (SELECT OO.small_classi_name
                           FROM ajict_bms_schema.commonness_code OO
                           WHERE OO.great_classi_code = A.progress1_rate_code AND
                                 OO.small_classi_code = A.progress2_rate_code) AS progress2_rate_name,
                          sale_item_no,
                          sale_date,
                          sale_amt,
                          sale_profit,
                          purchase_date,
                          purchase_amt,
                          biz_section1_code,
                          biz_section2_code,
                         (SELECT DISTINCT FF.great_classi_name
                          FROM ajict_bms_schema.commonness_code FF
                          WHERE FF.great_classi_code = A.biz_section1_code) AS biz_section1_name,
                         (SELECT GG.small_classi_name
                          FROM ajict_bms_schema.commonness_code GG
                          WHERE GG.great_classi_code = A.biz_section1_code AND
                                GG.small_classi_code = A.biz_section2_code) AS biz_section2_name,
                         essential_achievement_tf,
                         product1_code,
                         product2_code,
                         (SELECT DISTINCT HH.great_classi_name
                          FROM ajict_bms_schema.commonness_code HH
                          WHERE HH.great_classi_code = A.product1_code) AS product1_name,
                         (SELECT II.small_classi_name
                          FROM ajict_bms_schema.commonness_code II
                          WHERE II.great_classi_code = A.product1_code AND
                                II.small_classi_code = A.product2_code) AS product2_name,
                         (SELECT JJ.dept_id
                          FROM ajict_bms_schema.aj_user JJ
                          WHERE JJ.user_id = A.user_id) AS dept_id,
                         (SELECT KK.high_dept_id
                          FROM ajict_bms_schema.dept KK
                          WHERE KK.dept_id = (SELECT AAA.dept_id
                                              FROM ajict_bms_schema.aj_user AAA
                                              WHERE AAA.user_id = A.user_id)) AS high_dept_id,
                         (SELECT LL.dept_name
                          FROM ajict_bms_schema.dept LL
                          WHERE LL.dept_id = (SELECT BBB.dept_id
                                              FROM ajict_bms_schema.aj_user BBB
                                              WHERE BBB.user_id = A.user_id)) AS dept_name,
                         (SELECT MM.dept_name
                          FROM ajict_bms_schema.dept MM
                          WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                              FROM ajict_bms_schema.dept CCC
                                              WHERE CCC.dept_id = (SELECT AAAA.dept_id
                                                                   FROM ajict_bms_schema.aj_user AAAA
                                                                   WHERE AAAA.user_id = A.user_id))) AS high_dept_name,
                         create_user,
                         create_date,
                         update_user,
                         update_date,
                         delete_user,
                         delete_date
                    FROM ajict_bms_schema.biz_opp A
                    WHERE 1 =1 """
         v_param = []
         if v_progress_rate_code_from:
            if v_progress_rate_code_to:
               v_sql += "AND progress1_rate_code = 'PRO' AND progress2_rate_code BETWEEN %s AND %s"
               v_param.append(v_progress_rate_code_from)
               v_param.append(v_progress_rate_code_to)
               with connection.cursor() as v_cursor:
                  v_cursor.execute(v_sql,v_param)
                  v_columns = [v_column[0] for v_column in v_cursor.description]
                  v_rows = v_cursor.fetchall()
                  v_data = [[dict(zip(v_columns,row)) for row in v_rows]]
                  if not v_data:
                     v_return = {"STATUS": "NONE","MESSAGE": "Data가 존재하지 않습니다."}
                     return JsonResponse(v_data,safe=False,json_dumps_params={'ensure_ascii':False})
                  else:
                     v_additional_info = {"STATUS": "SUCCESS","MESSAGE": "조회되었습니다."}
                     v_data.append(v_additional_info)
      #logging.debug(f"v_data : {v_data}")
                     return JsonResponse(v_data,safe=False,json_dumps_params={'ensure_ascii':False})
      except json.JSONDecodeError:
         return JsonResponse({"STATUS":"JSON","MESSAGE":"JSON의 format가 틀립니다."})
def f_select_biz_opp2(request):
   if request.method == "POST":
      try:
         v_progress_rate_code_from = request.POST.get('a_progress_rate_code_from')
         v_progress_rate_code_to = request.POST.get('a_progress_rate_code_to')
      #v_user_id = request.POST.get('a_user_id')
      #v_cipher = request.POST.get('a_cipher')
      # v_progress_rate_from = request.POST.get('a_progress_rate_from')
      # v_progress_rate_to = request.POST.get('a_progress_rate_to')
      # v_contract_date_from = request.POST.get('a_contract_date_from')
      # v_contract_date_to = request.POST.get('a_contract_date_to')
      # v_sale_date_from = request.POST.get('a_sale_date_from')
      # v_sale_date_to = request.POST.get('a_sale_date_to')
      # v_essential_achievement_tf = request.POST.get('a_essential_achievement_tf')
#   v_progress_rate_code_from = '0001'
#   v_progress_rate_code_to = '0006'
         v_sql = """SELECT biz_opp_id,
                           biz_opp_name,
                           user_id,
                           (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = A.user_id) AS user_name,
                           change_preparation_dept_id,
                           change_preparation_dept_name,
                           last_client_com1_code,
                           last_client_com2_code,
                           (SELECT DISTINCT BB.great_classi_name
                            FROM ajict_bms_schema.commonness_code BB
                            WHERE BB.great_classi_code = A.last_client_com1_code) AS last_client_com1_name,
                           (SELECT CC.small_classi_name
                            FROM ajict_bms_schema.commonness_code CC
                            WHERE CC.great_classi_code = A.last_client_com1_code AND
                                  CC.small_classi_code = A.last_client_com2_code) AS last_client_com2_name,
                           sale_com1_code,
                           sale_com2_code,
                           (SELECT DISTINCT DD.great_classi_name
                            FROM ajict_bms_schema.commonness_code DD
                            WHERE DD.great_classi_code = A.sale_com1_code) AS sale_com1_name,
                           (SELECT EE.small_classi_name
                            FROM ajict_bms_schema.commonness_code EE
                            WHERE EE.great_classi_code = A.sale_com1_code AND
                                  EE.small_classi_code = A.sale_com2_code) AS sale_com2_name,
                           contract_date,
                           progress1_rate_code,
                           progress2_rate_code,
                          (SELECT DISTINCT NN.great_classi_name
                           FROM ajict_bms_schema.commonness_code NN
                           WHERE NN.great_classi_code = A.progress1_rate_code) AS progress1_rate_name,
                          (SELECT OO.small_classi_name
                           FROM ajict_bms_schema.commonness_code OO
                           WHERE OO.great_classi_code = A.progress1_rate_code AND
                                 OO.small_classi_code = A.progress2_rate_code) AS progress2_rate_name,
                          sale_item_no,
                          sale_date,
                          sale_amt,
                          sale_profit,
                          purchase_date,
                          purchase_amt,
                          biz_section1_code,
                          biz_section2_code,
                         (SELECT DISTINCT FF.great_classi_name
                          FROM ajict_bms_schema.commonness_code FF
                          WHERE FF.great_classi_code = A.biz_section1_code) AS biz_section1_name,
                         (SELECT GG.small_classi_name
                          FROM ajict_bms_schema.commonness_code GG
                          WHERE GG.great_classi_code = A.biz_section1_code AND
                                GG.small_classi_code = A.biz_section2_code) AS biz_section2_name,
                         essential_achievement_tf,
                         product1_code,
                         product2_code,
                         (SELECT DISTINCT HH.great_classi_name
                          FROM ajict_bms_schema.commonness_code HH
                          WHERE HH.great_classi_code = A.product1_code) AS product1_name,
                         (SELECT II.small_classi_name
                          FROM ajict_bms_schema.commonness_code II
                          WHERE II.great_classi_code = A.product1_code AND
                                II.small_classi_code = A.product2_code) AS product2_name,
                         (SELECT JJ.dept_id
                          FROM ajict_bms_schema.aj_user JJ
                          WHERE JJ.user_id = A.user_id) AS dept_id,
                         (SELECT KK.high_dept_id
                          FROM ajict_bms_schema.dept KK
                          WHERE KK.dept_id = (SELECT AAA.dept_id
                                              FROM ajict_bms_schema.aj_user AAA
                                              WHERE AAA.user_id = A.user_id)) AS high_dept_id,
                         (SELECT LL.dept_name
                          FROM ajict_bms_schema.dept LL
                          WHERE LL.dept_id = (SELECT BBB.dept_id
                                              FROM ajict_bms_schema.aj_user BBB
                                              WHERE BBB.user_id = A.user_id)) AS dept_name,
                         (SELECT MM.dept_name
                          FROM ajict_bms_schema.dept MM
                          WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                              FROM ajict_bms_schema.dept CCC
                                              WHERE CCC.dept_id = (SELECT AAAA.dept_id
                                                                   FROM ajict_bms_schema.aj_user AAAA
                                                                   WHERE AAAA.user_id = A.user_id))) AS high_dept_name,
                         create_user,
                         create_date,
                         update_user,
                         update_date,
                         delete_user,
                         delete_date
                    FROM ajict_bms_schema.biz_opp A
                    WHERE 1 =1 """
         v_param = []
         if v_progress_rate_code_from:
            if v_progress_rate_code_to:
               v_sql += "AND progress1_rate_code = 'PRO' AND progress2_rate_code BETWEEN %s AND %s"
               v_param.append(v_progress_rate_code_from)
               v_param.append(v_progress_rate_code_to)
               with connection.cursor() as v_cursor:
                  v_cursor.execute(v_sql,v_param)
                  v_columns = [v_column[0] for v_column in v_cursor.description]
                  v_rows = v_cursor.fetchall()
                  v_data = [dict(zip(v_columns,row)) for row in v_rows]
                  if not v_data:
                     return JsonResponse({"STATUS": "NONE","MESSAGE": "Data가 존재하지 않습니다."})
                  else:
                     v_additional_info = {"STATUS": "SUCCESS","MESSAGE": "조회되었습니다."}
                     v_data.append(v_additional_info)
      # logging.debug(f"v_data : {v_data}")
                     return JsonResponse(v_data,safe=False,json_dumps_params={'ensure_ascii':False})
      except json.JSONDecodeError:
         return JsonResponse({"STATUS":"JSON","MESSAGE":"JSON의 format가 틀립니다."})


# def f_insert_biz_opp(request):
#   if request.method == "POST":