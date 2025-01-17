import json
import logging
from datetime import datetime
from django.contrib.auth import logout
from django.db import connection
from django.db import transaction
from django.http import JsonResponse
from django.db import DatabaseError
from django.template.context_processors import request
logging.basicConfig(level=logging.DEBUG)
def f_login(request):
   request.session.flush()
   v_user_id = ''
   v_cipher = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_user_id = None if v_body.get('a_user_id') == '' else v_body.get('a_user_id')
      v_cipher = None if v_body.get('a_cipher') == '' else v_body.get('a_cipher')
      if v_user_id is not None:
         v_user_id = v_user_id.strip()
      if v_cipher is not None:
         v_cipher = v_cipher.strip()
   try:
      v_sql1 = """SELECT COUNT(*) AS count FROM ajict_bms_schema.aj_user WHERE user_id = %s AND delete_date IS NULL"""
      v_param1 = []
      v_param1.append(v_user_id)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql1,v_param1)
         v_row1 = v_cursor.fetchone()
         v_count1 = v_row1[0]
         if v_count1 == 0:
            v_data1 = {'STATUS':'FAIL','MESSAGE':'존재하지 않는 사용자 ID입니다.'}
            v_square_bracket_data1 = [v_data1]
            return JsonResponse(v_square_bracket_data1,safe = False,json_dumps_params={'ensure_ascii':False})
      v_sql2 = """SELECT COUNT(*) AS count FROM ajict_bms_schema.aj_user WHERE user_id = %s AND cipher = %s AND delete_date IS NULL"""
      v_param2=[]
      v_param2.append(v_user_id)
      v_param2.append(v_cipher)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql2,v_param2)
         v_row2 = v_cursor.fetchone()
         v_count2 = v_row2[0]
         if v_count2 == 0:
            v_data2 = {'STATUS':'FAIL','MESSAGE':'비밀번호가 틀립니다.'}
            v_square_bracket_data2 = [v_data2]
            return JsonResponse(v_square_bracket_data2,safe = False,json_dumps_params={'ensure_ascii':False})
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
                        cipher = %s AND
                        delete_date IS NULL"""
      v_param3 = []
      v_param3.append(v_user_id)
      v_param3.append(v_cipher)
      with connection.cursor() as v_cursor:
         v_cursor.execute(v_sql3,v_param3)
         v_columns = [v_column[0] for v_column in v_cursor.description]
         v_rows = v_cursor.fetchall()
         v_data3 = [dict(zip(v_columns,row)) for row in v_rows]
         v_square_bracket_data3 = [v_data3]
         v_session = [f_serialize(row,v_columns) for row in v_rows]
         request.session['v_global_data'] = v_session


#Session의 값 중 일부를 추출할 수 있음.
         #v_global_data = request.session.get('v_global_data',{})
         #v_user_name = v_global_data[0].get('user_name')
         #logging.debug(f"*******************************************")
         #logging.debug(f"f_login()에서의 user_name : {v_user_name}")
         #logging.debug(f"*******************************************")


         v_additional_info = {'STATUS':'LOGIN','MESSAGE':'login 했습니다.'}
         v_square_bracket_additional_info = [v_additional_info]
         v_square_bracket_data3.append(v_square_bracket_additional_info)
         return JsonResponse(v_square_bracket_data3,safe = False,json_dumps_params={'ensure_ascii':False})
   except DatabaseError:
      v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   except json.JSONDecodeError:
      v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
def f_serialize(a_row,a_columns):
   v_row_dict = {}
   for v_column,v_value in zip(a_columns,a_row):
      if isinstance(v_value,datetime):
         v_row_dict[v_column] = v_value.isoformat()
      else:
         v_row_dict[v_column] = v_value
   return v_row_dict
def f_update_cipher_change(request):
   v_session_user_id = ''
   v_old_cipher = ''
   v_new_cipher = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
      v_old_cipher = None if v_body.get('a_old_cipher') == '' else v_body.get('a_old_cipher')
      if v_old_cipher is not None:
         v_old_cipher = v_old_cipher.strip()
      v_new_cipher = None if v_body.get('a_new_cipher') == '' else v_body.get('a_new_cipher')
      if v_new_cipher is not None:
         v_new_cipher = v_new_cipher.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   if v_old_cipher == v_new_cipher:
      v_return = {"STATUS":"FAIL","MESSAGE":"이전 비밀번호와 같습니다. 다르게 설정해주십시오."}
      return JsonResponse(v_return,safe = False,json_dumps_params={'ensure_ascii':False})
   if len(v_new_cipher) < 5:
      v_return = {"STATUS":"FAIL","MESSAGE":"비밀번호는 최소 5자리 이상이어야 합니다."}
      return JsonResponse(v_return,safe = False,json_dumps_params={'ensure_ascii':False})
   try:
      with transaction.atomic():
         v_sql = """UPDATE ajict_bms_schema.aj_user SET cipher = %s,beginning_login_tf = FALSE,update_date = CURRENT_TIMESTAMP WHERE user_id = %s AND delete_date IS NULL"""
         v_param=[]
         v_param.append(v_new_cipher)
         v_param.append(v_session_user_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql,v_param)
            v_return = {'STATUS':'SUCCESS','MESSAGE':"저장되었습니다."}
            v_square_bracket_return = [v_return]
            return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
   except DatabaseError:
      v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   except Exception as E:
      v_return = {'STATUS':'FAIL','MESSAGE':'System의 문제로 인해 비밀번호를 변경하지 못했습니다.','ERROR':str(E)}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
def f_logout(request):
   logout(request)
   v_return = {'STATUS':'LOGOUT','MESSAGE':'logout 했습니다.'}
   v_square_bracket_return = [v_return]
   return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
def f_select_biz_opp1(request):
   v_session_user_id = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_sql_session = """SELECT user_id,
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
                                       delete_date IS NULL"""
         v_param1 = []
         v_param1.append(v_session_user_id)
         v_auth1_code = ''
         v_auth2_code = ''
         v_responsibility1_code = ''
         v_responsibility2_code = ''
         v_user_id = ''
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_session,v_param1)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data_session = [dict(zip(v_columns,row)) for row in v_rows]
            v_auth1_code = v_data_session[0]['auth1_code']
            v_auth2_code = v_data_session[0]['auth2_code']
            v_responsibility1_code = v_data_session[0]['responsibility1_code']
            v_responsibility2_code = v_data_session[0]['responsibility2_code']
            v_user_id = v_data_session[0]['user_id']
            v_dept_id = v_data_session[0]['dept_id']
         v_data = {"search_headquarters":[],"search_team":[],"search_commonness_pro":[],"retrieve_biz_opp":[]}
         v_sql_headquarters = """SELECT * FROM ajict_bms_schema.dept WHERE LENGTH(dept_id) = 5 AND delete_date IS NULL ORDER BY dept_id"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_headquarters)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_headquarters"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_team = """SELECT * FROM ajict_bms_schema.dept WHERE LENGTH(dept_id) = 4 AND delete_date IS NULL ORDER BY dept_id"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_team)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_team"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_commonness_pro = """SELECT * FROM ajict_bms_schema.commonness_code WHERE great_classi_code = 'PRO' AND delete_date IS NULL ORDER BY small_classi_code"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_commonness_pro)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_commonness_pro"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_biz_opp = """SELECT A.biz_opp_id,
                                   A.biz_opp_name,
                                   B.detail_no,
                                   B.user_id,
                                   (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = B.user_id AND AA.delete_date IS NULL) AS user_name,
                                   B.change_preparation_dept_id,
                                   B.change_preparation_dept_name,
                                   B.last_client_com1_code,
                                   B.last_client_com2_code,
                                   (SELECT DISTINCT BB.great_classi_name
                                    FROM ajict_bms_schema.commonness_code BB
                                    WHERE BB.great_classi_code = B.last_client_com1_code AND
                                          BB.delete_date IS NULL) AS last_client_com1_name,
                                   (SELECT CC.small_classi_name
                                    FROM ajict_bms_schema.commonness_code CC
                                    WHERE CC.great_classi_code = B.last_client_com1_code AND
                                          CC.small_classi_code = B.last_client_com2_code AND
                                          CC.delete_date IS NULL) AS last_client_com2_name,
                                   B.sale_com1_code,
                                   B.sale_com2_code,
                                   (SELECT DISTINCT DD.great_classi_name
                                    FROM ajict_bms_schema.commonness_code DD
                                    WHERE DD.great_classi_code = B.sale_com1_code AND
                                          DD.delete_date IS NULL) AS sale_com1_name,
                                   (SELECT EE.small_classi_name
                                    FROM ajict_bms_schema.commonness_code EE
                                    WHERE EE.great_classi_code = B.sale_com1_code AND
                                          EE.small_classi_code = B.sale_com2_code AND
                                          EE.delete_date IS NULL) AS sale_com2_name,
                                   A.contract_date,
                                   A.progress1_rate_code,
                                   A.progress2_rate_code,
                                   (SELECT DISTINCT NN.great_classi_name
                                    FROM ajict_bms_schema.commonness_code NN
                                    WHERE NN.great_classi_code = A.progress1_rate_code AND
                                          NN.delete_date IS NULL) AS progress1_rate_name,
                                   (SELECT OO.small_classi_name
                                    FROM ajict_bms_schema.commonness_code OO
                                    WHERE OO.great_classi_code = A.progress1_rate_code AND
                                          OO.small_classi_code = A.progress2_rate_code AND
                                          OO.delete_date IS NULL) AS progress2_rate_name,
                                   B.sale_item_no,
                                   B.sale_date,
                                   B.sale_amt,
                                   B.sale_profit,
                                   B.purchase_date,
                                   B.purchase_amt,
                                   B.collect_money_date,
                                   B.biz_section1_code,
                                   B.biz_section2_code,
                                   (SELECT DISTINCT FF.great_classi_name
                                    FROM ajict_bms_schema.commonness_code FF
                                    WHERE FF.great_classi_code = B.biz_section1_code AND
                                          FF.delete_date IS NULL) AS biz_section1_name,
                                   (SELECT GG.small_classi_name
                                    FROM ajict_bms_schema.commonness_code GG
                                    WHERE GG.great_classi_code = B.biz_section1_code AND
                                          GG.small_classi_code = B.biz_section2_code AND
                                          GG.delete_date IS NULL) AS biz_section2_name,
                                   A.essential_achievement_tf,
                                   B.principal_product1_code,
                                   B.principal_product2_code,
                                   (SELECT DISTINCT HH.great_classi_name
                                    FROM ajict_bms_schema.commonness_code HH
                                    WHERE HH.great_classi_code = B.principal_product1_code AND
                                          HH.delete_date IS NULL) AS product1_name,
                                   (SELECT II.small_classi_name
                                    FROM ajict_bms_schema.commonness_code II
                                    WHERE II.great_classi_code = B.principal_product1_code AND
                                          II.small_classi_code = B.principal_product2_code AND
                                          II.delete_date IS NULL) AS product2_name,
                                   (SELECT JJ.dept_id
                                    FROM ajict_bms_schema.aj_user JJ
                                    WHERE JJ.user_id = B.user_id AND
                                          JJ.delete_date IS NULL) AS dept_id,
                                   (SELECT KK.high_dept_id
                                    FROM ajict_bms_schema.dept KK
                                    WHERE KK.dept_id = (SELECT AAA.dept_id
                                                        FROM ajict_bms_schema.aj_user AAA
                                                        WHERE AAA.user_id = B.user_id AND
                                                              AAA.delete_date IS NULL) AND
                                          KK.delete_date IS NULL) AS high_dept_id,
                                   (SELECT LL.dept_name
                                    FROM ajict_bms_schema.dept LL
                                    WHERE LL.dept_id = (SELECT BBB.dept_id
                                                        FROM ajict_bms_schema.aj_user BBB
                                                        WHERE BBB.user_id = B.user_id AND
                                                              BBB.delete_date IS NULL) AND
                                          LL.delete_date IS NULL) AS dept_name,
                                   (SELECT MM.dept_name
                                    FROM ajict_bms_schema.dept MM
                                    WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                                        FROM ajict_bms_schema.dept CCC
                                                        WHERE CCC.dept_id = (SELECT AAAA.dept_id
                                                                             FROM ajict_bms_schema.aj_user AAAA
                                                                             WHERE AAAA.user_id = B.user_id AND
                                                                                   AAAA.delete_date IS NULL) AND
                                                              CCC.delete_date IS NULL) AND
                                          MM.delete_date IS NULL) AS high_dept_name,
                                   A.create_user AS biz_opp_create_user,
                                   A.create_date AS biz_opp_create_date,
                                   A.update_user AS biz_opp_update_user,
                                   A.update_date AS biz_opp_update_date,
                                   A.delete_user AS biz_opp_delete_user,
                                   A.delete_date AS biz_opp_delete_date,
                                   B.create_user AS biz_opp_detail_create_user,
                                   B.create_date AS biz_opp_detail_create_date,
                                   B.update_user AS biz_opp_detail_update_user,
                                   B.update_date AS biz_opp_detail_update_date,
                                   B.delete_user AS biz_opp_detail_delete_user,
                                   B.delete_date AS biz_opp_detail_delete_date
                            FROM ajict_bms_schema.biz_opp A,
                                 ajict_bms_schema.biz_opp_detail B
                            WHERE 1 = 1 AND
                                  A.biz_opp_id = B.biz_opp_id AND
                                  A.delete_date IS NULL AND
                                  B.delete_date IS NULL"""
#                                  A.contract_date BETWEEN %s AND %s AND
#                                  B.sale_date BETWEEN %s AND %s"""
         v_param2 = []
#         v_current_year = datetime.now().year
#         v_contract_from_date = str(v_current_year) + '0101'
#         v_param2.append(v_contract_from_date)
#         v_contract_to_date = str(datetime.now().strftime('%Y%m%d'))
#         v_param2.append(v_contract_to_date)
#         v_sale_from_date = v_contract_from_date
#         v_param2.append(v_sale_from_date)
#         v_sale_to_date = v_contract_to_date
#         v_param2.append(v_sale_to_date)
         if v_auth1_code == 'AUT' and v_auth2_code == '0003':
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0003':
               v_sql_biz_opp += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
               v_param2.append(v_dept_id)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0002':
               v_sql_biz_opp += " AND B.change_preparation_dept_id = %s"
               v_param2.append(v_dept_id)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0001':
               v_sql_biz_opp += " AND B.user_id = %s"
               v_param2.append(v_user_id)
         v_sql_biz_opp += " ORDER BY A.biz_opp_id,\
                                     B.detail_no"

         #test
         #v_formatted_sql = v_sql_biz_opp % tuple(map(repr,v_param2))
         #print(f"f_select_biz_opp1()에서의 v_formatted_sql : {v_formatted_sql}")


         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_opp,v_param2)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["retrieve_biz_opp"] = [dict(zip(v_columns,row)) for row in v_rows]


#test
            #print(f"f_select_biz_opp1()에서의 v_rows_biz_opp : {v_data["retrieve_biz_opp"]}")


            if not v_data["retrieve_biz_opp"]:
               v_status = {"STATUS":"NONE","MESSAGE":"Data가 존재하지 않습니다."}
            else:
               v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
         return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params={'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
def f_select_biz_opp2(request):
   v_session_user_id = ''
   v_body = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_sql_session = """SELECT user_id,
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
                                       delete_date IS NULL"""
         v_param1 = []
         v_param1.append(v_session_user_id)
         v_auth1_code = ''
         v_auth2_code = ''
         v_responsibility1_code = ''
         v_responsibility2_code = ''
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_session,v_param1)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data_session = [dict(zip(v_columns,row)) for row in v_rows]
            v_auth1_code = v_data_session[0]['auth1_code']
            v_auth2_code = v_data_session[0]['auth2_code']
            v_responsibility1_code = v_data_session[0]['responsibility1_code']
            v_responsibility2_code = v_data_session[0]['responsibility2_code']
         v_contract_date_from = None if v_body.get('a_contract_date_from') == '' else v_body.get('a_contract_date_from')
         if v_contract_date_from is not None:
            v_contract_date_from = v_contract_date_from.strip()
         v_contract_date_to = None if v_body.get('a_contract_date_to') == '' else v_body.get('a_contract_date_to')
         if v_contract_date_to is not None:
            v_contract_date_to = v_contract_date_to.strip()
         v_sale_date_from = None if v_body.get('a_sale_date_from') == '' else v_body.get('a_sale_date_from')
         if v_sale_date_from is not None:
            v_sale_date_from = v_sale_date_from.strip()
         v_sale_date_to = None if v_body.get('a_sale_date_to') == '' else v_body.get('a_sale_date_to')
         if v_sale_date_to is not None:
            v_sale_date_to = v_sale_date_to.strip()
         v_headquarters_dept_id = None if v_body.get('a_headquarters_dept_id') == '' else v_body.get('a_headquarters_dept_id')
         if v_headquarters_dept_id is not None:
            v_headquarters_dept_id = v_headquarters_dept_id.strip()
         v_team_dept_id = None if v_body.get('a_dept_id') == '' else v_body.get('a_dept_id')
         if v_team_dept_id is not None:
            v_team_dept_id = v_team_dept_id.strip()
         v_user_name = None if v_body.get('a_user_name') == '' else v_body.get('a_user_name')
         if v_user_name is not None:
            v_user_name = v_user_name.strip()
         v_progress_rate_code_from = None if v_body.get('a_progress_rate_code_from') == '' else v_body.get('a_progress_rate_code_from')
         if v_progress_rate_code_from is not None:
            v_progress_rate_code_from = v_progress_rate_code_from.strip()
         v_progress_rate_code_to = None if v_body.get('a_progress_rate_code_to') == '' else v_body.get('a_progress_rate_code_to')
         if v_progress_rate_code_to is not None:
            v_progress_rate_code_to = v_progress_rate_code_to.strip()
         v_essential_achievement_tf = v_body.get('a_essential_achievement_tf')
         v_sql_biz_opp = """SELECT A.biz_opp_id,
                                   B.detail_no,
                                   A.biz_opp_name,
                                   B.user_id,
                                   (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = B.user_id AND AA.delete_date IS NULL) AS user_name,
                                   B.change_preparation_dept_id,
                                   B.change_preparation_dept_name,
                                   B.last_client_com1_code,
                                   B.last_client_com2_code,
                                   (SELECT DISTINCT BB.great_classi_name
                                    FROM ajict_bms_schema.commonness_code BB
                                    WHERE BB.great_classi_code = B.last_client_com1_code AND
                                          BB.delete_date IS NULL) AS last_client_com1_name,
                                   (SELECT CC.small_classi_name
                                    FROM ajict_bms_schema.commonness_code CC
                                    WHERE CC.great_classi_code = B.last_client_com1_code AND
                                          CC.small_classi_code = B.last_client_com2_code AND
                                          CC.delete_date IS NULL) AS last_client_com2_name,
                                   B.sale_com1_code,
                                   B.sale_com2_code,
                                   (SELECT DISTINCT DD.great_classi_name
                                    FROM ajict_bms_schema.commonness_code DD
                                    WHERE DD.great_classi_code = B.sale_com1_code AND
                                          DD.delete_date IS NULL) AS sale_com1_name,
                                   (SELECT EE.small_classi_name
                                    FROM ajict_bms_schema.commonness_code EE
                                    WHERE EE.great_classi_code = B.sale_com1_code AND
                                          EE.small_classi_code = B.sale_com2_code AND
                                          EE.delete_date IS NULL) AS sale_com2_name,
                                   A.contract_date,
                                   A.progress1_rate_code,
                                   A.progress2_rate_code,
                                   (SELECT DISTINCT NN.great_classi_name
                                    FROM ajict_bms_schema.commonness_code NN
                                    WHERE NN.great_classi_code = A.progress1_rate_code AND
                                          NN.delete_date IS NULL) AS progress1_rate_name,
                                   (SELECT OO.small_classi_name
                                    FROM ajict_bms_schema.commonness_code OO
                                    WHERE OO.great_classi_code = A.progress1_rate_code AND
                                          OO.small_classi_code = A.progress2_rate_code AND
                                          OO.delete_date IS NULL) AS progress2_rate_name,
                                   B.sale_item_no,
                                   B.sale_date,
                                   B.sale_amt,
                                   B.sale_profit,
                                   B.purchase_date,
                                   B.purchase_amt,
                                   B.collect_money_date,
                                   B.biz_section1_code,
                                   B.biz_section2_code,
                                   (SELECT DISTINCT FF.great_classi_name
                                    FROM ajict_bms_schema.commonness_code FF
                                    WHERE FF.great_classi_code = B.biz_section1_code AND
                                          FF.delete_date IS NULL) AS biz_section1_name,
                                   (SELECT GG.small_classi_name
                                    FROM ajict_bms_schema.commonness_code GG
                                    WHERE GG.great_classi_code = B.biz_section1_code AND
                                          GG.small_classi_code = B.biz_section2_code AND
                                          GG.delete_date IS NULL) AS biz_section2_name,
                                   A.essential_achievement_tf,
                                   B.principal_product1_code,
                                   B.principal_product2_code,
                                   (SELECT DISTINCT HH.great_classi_name
                                    FROM ajict_bms_schema.commonness_code HH
                                    WHERE HH.great_classi_code = B.principal_product1_code AND
                                          HH.delete_date IS NULL) AS product1_name,
                                   (SELECT II.small_classi_name
                                    FROM ajict_bms_schema.commonness_code II
                                    WHERE II.great_classi_code = B.principal_product1_code AND
                                          II.small_classi_code = B.principal_product2_code AND
                                          II.delete_date IS NULL) AS product2_name,
                                   (SELECT JJ.dept_id
                                    FROM ajict_bms_schema.aj_user JJ
                                    WHERE JJ.user_id = B.user_id AND
                                          JJ.delete_date IS NULL) AS dept_id,
                                   (SELECT KK.high_dept_id
                                    FROM ajict_bms_schema.dept KK
                                    WHERE KK.dept_id = (SELECT AAA.dept_id
                                                        FROM ajict_bms_schema.aj_user AAA
                                                        WHERE AAA.user_id = B.user_id AND
                                                              AAA.delete_date IS NULL) AND
                                          KK.delete_date IS NULL) AS high_dept_id,
                                   (SELECT LL.dept_name
                                    FROM ajict_bms_schema.dept LL
                                    WHERE LL.dept_id = (SELECT BBB.dept_id
                                                        FROM ajict_bms_schema.aj_user BBB
                                                        WHERE BBB.user_id = B.user_id AND
                                                              BBB.delete_date IS NULL) AND
                                          LL.delete_date IS NULL) AS dept_name,
                                   (SELECT MM.dept_name
                                    FROM ajict_bms_schema.dept MM
                                    WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                                        FROM ajict_bms_schema.dept CCC
                                                        WHERE CCC.dept_id = (SELECT AAAA.dept_id
                                                                             FROM ajict_bms_schema.aj_user AAAA
                                                                             WHERE AAAA.user_id = B.user_id AND
                                                                                   AAAA.delete_date IS NULL) AND
                                                              CCC.delete_date IS NULL) AND
                                          MM.delete_date IS NULL) AS high_dept_name,
                                   A.create_user AS biz_opp_create_user,
                                   A.create_date AS biz_opp_create_date,
                                   A.update_user AS biz_opp_update_user,
                                   A.update_date AS biz_opp_update_date,
                                   A.delete_user AS biz_opp_delete_user,
                                   A.delete_date AS biz_opp_delete_date,
                                   B.create_user AS biz_opp_detail_create_user,
                                   B.create_date AS biz_opp_detail_create_date,
                                   B.update_user AS biz_opp_detail_update_user,
                                   B.update_date AS biz_opp_detail_update_date,
                                   B.delete_user AS biz_opp_detail_delete_user,
                                   B.delete_date AS biz_opp_detail_delete_date
                            FROM ajict_bms_schema.biz_opp A,
                                 ajict_bms_schema.biz_opp_detail B
                            WHERE 1 = 1 AND
                                  A.biz_opp_id = B.biz_opp_id AND
                                  A.delete_date IS NULL AND
                                  B.delete_date IS NULL"""
         v_param2 = []
         if not v_contract_date_from:
            v_contract_date_from = '19500101'
         if not v_contract_date_to:
            v_contract_date_to = '20401231'
         if not v_sale_date_from:
            v_sale_date_from = '19500101'
         if not v_sale_date_to:
            v_sale_date_to = '20401231'
         v_sql_biz_opp += " AND A.contract_date BETWEEN %s AND %s"
         v_param2.append(v_contract_date_from)
         v_param2.append(v_contract_date_to)
         v_sql_biz_opp += " AND B.sale_date BETWEEN %s AND %s"
         v_param2.append(v_sale_date_from)
         v_param2.append(v_sale_date_to)
         if not v_progress_rate_code_from:
            v_progress_rate_code_from = '0001'
         if not v_progress_rate_code_to:
            v_progress_rate_code_to = '0006'
         v_sql_biz_opp += " AND A.progress1_rate_code = 'PRO' AND A.progress2_rate_code BETWEEN %s AND %s"
         v_param2.append(v_progress_rate_code_from)
         v_param2.append(v_progress_rate_code_to)
         if v_essential_achievement_tf:
            v_sql_biz_opp += " AND A.essential_achievement_tf = TRUE"
         else:
            v_sql_biz_opp += " AND A.essential_achievement_tf = FALSE"
         if v_auth1_code == 'AUT' and (v_auth2_code == '0001' or v_auth2_code == '0002'):
            if v_headquarters_dept_id:
               if v_headquarters_dept_id == '97100' or v_headquarters_dept_id == '97200':
                  v_sql_biz_opp += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
               else:
                  v_sql_biz_opp += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 2) || '%%'"
               v_param2.append(v_headquarters_dept_id)
            if v_team_dept_id:
               v_sql_biz_opp += " AND B.change_preparation_dept_id = %s"
               v_param2.append(v_team_dept_id)
            if v_user_name:
               v_sql_biz_opp += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
               v_param2.append(v_user_name)
         if v_auth1_code == 'AUT' and v_auth2_code == '0003':
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0003':
               if v_headquarters_dept_id and not v_team_dept_id:
                  v_sql_biz_opp += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
                  v_param2.append(v_headquarters_dept_id)
               if v_headquarters_dept_id and v_team_dept_id:
                  v_sql_biz_opp += " AND B.change_preparation_dept_id = %s"
                  v_param2.append(v_team_dept_id)
               if v_user_name:
                  v_sql_biz_opp += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
                  v_param2.append(v_user_name)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0002':
               if v_team_dept_id:
                  v_sql_biz_opp += " AND B.change_preparation_dept_id = %s"
                  v_param2.append(v_team_dept_id)
               if v_user_name:
                  v_sql_biz_opp += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
                  v_param2.append(v_user_name)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0001':
               v_sql_biz_opp += " AND B.user_id = %s"
               v_param2.append(v_session_user_id)
         v_sql_biz_opp += " ORDER BY A.biz_opp_id,\
                                     B.detail_no"
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_opp,v_param2)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data = [dict(zip(v_columns,row)) for row in v_rows]
            if not v_data:
               v_status = {"STATUS":"NONE","MESSAGE":"Data가 존재하지 않습니다."}
            else:
               v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
            return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params = {'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
def f_select_popup_biz_opp(request):
   v_session_user_id = ''
   v_status = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_data = {"search_last_client_com_code":[],"search_biz_section_code":[],"search_principal_product_code":[],"search_dept_id":[]}
         v_sql_last_client_com_code = """SELECT * FROM ajict_bms_schema.commonness_code WHERE great_classi_code = 'COR' AND delete_date IS NULL ORDER BY small_classi_code"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_last_client_com_code)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_last_client_com_code"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_biz_section_code = """SELECT * FROM ajict_bms_schema.commonness_code WHERE great_classi_code = 'BIZ' AND delete_date IS NULL ORDER BY small_classi_code"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_section_code)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_biz_section_code"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_principal_product_code = """SELECT * FROM ajict_bms_schema.commonness_code WHERE great_classi_code = 'PRI' AND delete_date IS NULL ORDER BY small_classi_code"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_principal_product_code)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
         v_data["search_principal_product_code"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_dept_id = """SELECT * FROM ajict_bms_schema.dept WHERE delete_date IS NULL"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_dept_id)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
         v_data["search_dept_id"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
         return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params = {'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
def f_insert_biz_opp(request):
   v_session_user_id = ''
   v_body = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      #if v_session_user_id is not None:
      #   v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_sql_session = """SELECT user_id,
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
                                         delete_date IS NULL"""
         v_param1 = []
         v_param1.append(v_session_user_id)
         v_auth1_code = ''
         v_auth2_code = ''
         v_dept_id = ''
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_session,v_param1)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data_session = [dict(zip(v_columns,row)) for row in v_rows]
            v_auth1_code = v_data_session[0]['auth1_code']
            v_auth2_code = v_data_session[0]['auth2_code']
            v_dept_id = v_data_session[0]['dept_id']
         v_biz_opp_id = ''
         with transaction.atomic():
            v_sql_max = """SELECT CASE WHEN (SELECT COUNT(*) FROM ajict_bms_schema.biz_opp WHERE SUBSTRING(biz_opp_id FROM 1 FOR 4) = TO_CHAR(NOW(),'YYYY')) > 0
                                       THEN (SELECT TO_CHAR(NOW(),'YYYY') || LPAD(MAX(SUBSTRING(biz_opp_id FROM 5 FOR 4)::INTEGER + 1)::TEXT,4,'0') FROM ajict_bms_schema.biz_opp WHERE SUBSTRING(biz_opp_id FROM 1 FOR 4) = TO_CHAR(NOW(),'YYYY'))
                                       ELSE TO_CHAR(NOW(),'YYYY') || '0001'
                                  END AS biz_opp_id"""
            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_max)
               v_row1 = v_cursor.fetchone()
               v_biz_opp_id = v_row1[0]
            v_sql_insert_biz_opp = """INSERT INTO ajict_bms_schema.biz_opp (biz_opp_id,
                                                                            biz_opp_name,
                                                                            progress1_rate_code,
                                                                            progress2_rate_code,
                                                                            contract_date,
                                                                            essential_achievement_tf,
                                                                            create_user)
                                                                           VALUES (%s,
                                                                                   %s,
                                                                                   'PRO',
                                                                                   %s,
                                                                                   %s,
                                                                                   %s,
                                                                                   %s)"""
            v_param_insert_biz_opp = []
            v_param_insert_biz_opp.append(v_biz_opp_id)
            v_biz_opp_name = None if v_body.get('biz_opp',{}).get('a_biz_opp_name') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_name')

            v_biz_opp_name = None if v_body.get('biz_opp') == '' else v_body.get('biz_opp')
            #if v_biz_opp_name is not None:
            #   v_biz_opp_name = v_biz_opp_name.strip()
            if not v_biz_opp_name:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'사업 (기회)명' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp.append(v_biz_opp_name)
            v_progress2_rate_code = None if v_body.get('biz_opp',{}).get('a_progress2_rate_code') == '' else v_body.get('biz_opp',{}).get('a_progress2_rate_code')
            #if v_progress2_rate_code is not None:
            #   v_progress2_rate_code = v_progress2_rate_code.strip()
            if not v_progress2_rate_code:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'진행률' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp.append(v_progress2_rate_code)
            v_contract_date = None if v_body.get('biz_opp',{}).get('a_contract_date') == '' else v_body.get('biz_opp',{}).get('a_contract_date')
            #if v_contract_date is not None:
            #   v_contract_date = v_contract_date.strip()
            if not v_contract_date:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'계약 일자' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp.append(v_contract_date)
            v_param_insert_biz_opp.append(v_body.get('biz_opp',{}).get('a_essential_achievement_tf'))
            v_param_insert_biz_opp.append(v_session_user_id)

            #test
            v_formatted_sql = v_sql_insert_biz_opp % tuple(map(repr,v_param_insert_biz_opp))
            print(f"f_insert_biz_opp()에서의 v_formatted_sql : {v_formatted_sql}")


            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_insert_biz_opp,v_param_insert_biz_opp)
            v_sql_insert_biz_opp_detail = """INSERT INTO ajict_bms_schema.biz_opp_detail (biz_opp_id,
                                                                                          detail_no,
                                                                                          user_id,
                                                                                          change_preparation_dept_id,
                                                                                          change_preparation_dept_name,
                                                                                          last_client_com1_code,
                                                                                          last_client_com2_code,
                                                                                          sale_com1_code,
                                                                                          sale_com2_code,
                                                                                          sale_item_no,
                                                                                          sale_date,
                                                                                          sale_amt,
                                                                                          sale_profit,
                                                                                          purchase_date,
                                                                                          purchase_amt,
                                                                                          collect_money_date,
                                                                                          biz_section1_code,
                                                                                          biz_section2_code,
                                                                                          principal_product1_code,
                                                                                          principal_product2_code,
                                                                                          create_user)
                                                                                         VALUES (%s,
                                                                                                 1,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 (SELECT A.dept_name FROM ajict_bms_schema.dept A WHERE A.dept_id = %s),
                                                                                                 'COR',
                                                                                                 %s,
                                                                                                 'COR',
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 %s,
                                                                                                 'BIZ',
                                                                                                 %s,
                                                                                                 'COR',
                                                                                                 %s,
                                                                                                 %s)"""
            v_param_insert_biz_opp_detail = []
            v_param_insert_biz_opp_detail.append(v_biz_opp_id)
            v_change_preparation_dept_id = ''
            v_user_id = ''
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_user_name = None if v_body.get('biz_opp_detail',{}).get('a_user_name') == '' else v_body.get('biz_opp_detail',{}).get('a_user_name')
               #if v_user_name is not None:
               #   v_user_name = v_user_name.strip()
               if not v_user_name:
                  transaction.set_rollback(True)
                  v_return = {'STATUS':'FAIL','MESSAGE':"'사용자 ID' 항목은 필수 전달 항목입니다!"}
                  v_square_bracket_return = [v_return]
                  return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
               else:
                  v_sql_user = """SELECT user_id FROM ajict_bms_schema.aj_user WHERE user_name = %s AND delete_date IS NULL"""
                  v_param_select_user = []
                  v_param_select_user.append(v_user_name)
                  with connection.cursor() as v_cursor:
                     v_cursor.execute(v_sql_user,v_param_select_user)
                     v_row1 = v_cursor.fetchone()
                     v_user_id = v_row1[0]
                     v_param_insert_biz_opp_detail.append(v_user_id)
            else:
               v_param_insert_biz_opp_detail.append(v_session_user_id)
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_change_preparation_dept_id = None if v_body.get('biz_opp_detail',{}).get('a_change_preparation_dept_id') == '' else v_body.get('biz_opp_detail',{}).get('a_change_preparation_dept_id')
               #if v_change_preparation_dept_id is not None:
               #   v_change_preparation_dept_id = v_change_preparation_dept_id.strip()
               if not v_change_preparation_dept_id:
                  transaction.set_rollback(True)
                  v_return = {'STATUS':'FAIL','MESSAGE':"'변경 대비용 부서 ID' 항목은 필수 전달 항목입니다!"}
                  v_square_bracket_return = [v_return]
                  return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
               else:
                  v_param_insert_biz_opp_detail.append(v_change_preparation_dept_id)
            else:
               v_param_insert_biz_opp_detail.append(v_dept_id)
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_param_insert_biz_opp_detail.append(v_change_preparation_dept_id)
            else:
               v_param_insert_biz_opp_detail.append(v_dept_id)
            v_last_client_com2_code = None if v_body.get('biz_opp_detail',{}).get('a_last_client_com2_code') == '' else v_body.get('biz_opp_detail',{}).get('a_last_client_com2_code')
            #if v_last_client_com2_code is not None:
            #   v_last_client_com2_code = v_last_client_com2_code.strip()
            v_param_insert_biz_opp_detail.append(v_last_client_com2_code)
            v_sale_com2_code = None if v_body.get('biz_opp_detail',{}).get('a_sale_com2_code') == '' else v_body.get('biz_opp_detail',{}).get('a_sale_com2_code')
            #if v_sale_com2_code is not None:
            #   v_sale_com2_code = v_sale_com2_code.strip()
            if not v_sale_com2_code:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매출처2 code' 항목은 필수 전달 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_sale_com2_code)
            v_sale_item_no = None if v_body.get('biz_opp_detail',{}).get('a_sale_item_no') == '' else v_body.get('biz_opp_detail',{}).get('a_sale_item_no')
            #if v_sale_item_no is not None:
            #   v_sale_item_no = v_sale_item_no.strip()
            v_param_insert_biz_opp_detail.append(v_sale_item_no)
            v_sale_date = None if v_body.get('biz_opp_detail',{}).get('a_sale_date') == '' else v_body.get('biz_opp_detail',{}).get('a_sale_date')
            #if v_sale_date is not None:
            #   v_sale_date = v_sale_date.strip()
            if not v_sale_date:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매출 일자' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_sale_date)
            v_sale_amt = None if v_body.get('biz_opp_detail',{}).get('a_sale_amt') == '' else v_body.get('biz_opp_detail',{}).get('a_sale_amt')
            #if v_sale_amt is not None:
            #   v_sale_amt = v_sale_amt.strip()
            if not v_sale_amt:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매출 금액' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_sale_amt)
            v_sale_profit = None if v_body.get('biz_opp_detail',{}).get('a_sale_profit') == '' else v_body.get('biz_opp_detail',{}).get('a_sale_profit')
            #if v_sale_profit is not None:
            #   v_sale_profit = v_sale_profit.strip()
            if not v_sale_profit:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매출 이익' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_sale_profit)
            v_purchase_date = None if v_body.get('biz_opp_detail',{}).get('a_purchase_date') == '' else v_body.get('biz_opp_detail',{}).get('a_purchase_date')
            #if v_purchase_date is not None:
            #   v_purchase_date = v_purchase_date.strip()
            if not v_purchase_date:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매입 일자' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_purchase_date)
            v_purchase_amt = None if v_body.get('biz_opp_detail',{}).get('a_purchase_amt') == '' else v_body.get('biz_opp_detail',{}).get('a_purchase_amt')
            #if v_purchase_amt is not None:
            #   v_purchase_amt = v_purchase_amt.strip()
            if not v_purchase_amt:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'매입 금액' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_purchase_amt)
            v_collect_money_date = None if v_body.get('biz_opp_detail',{}).get('a_collect_money_date') == '' else v_body.get('biz_opp_detail',{}).get('a_collect_money_date')
            #if v_collect_money_date is not None:
            #   v_collect_money_date = v_collect_money_date.strip()
            v_param_insert_biz_opp_detail.append(v_collect_money_date)
            v_biz_section2_code = None if v_body.get('biz_opp_detail',{}).get('a_biz_section2_code') == '' else v_body.get('biz_opp_detail',{}).get('a_biz_section2_code')
            #if v_biz_section2_code is not None:
            #   v_biz_section2_code = v_biz_section2_code.strip()
            if not v_biz_section2_code:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'사업 구분2 code' 항목은 필수 전달 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_biz_section2_code)
            v_principal_product2_code = None if v_body.get('biz_opp_detail',{}).get('a_principal_product2_code') == '' else v_body.get('biz_opp_detail',{}).get('a_principal_product2_code')
            #if v_principal_product2_code is not None:
            #   v_principal_product2_code = v_principal_product2_code.strip()
            if not v_principal_product2_code:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'사업 구분2 code' 항목은 필수 전달 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_detail.append(v_principal_product2_code)
            v_param_insert_biz_opp_detail.append(v_session_user_id)


            #test
            v_formatted_sql = v_sql_insert_biz_opp_detail % tuple(map(repr,v_param_insert_biz_opp_detail))
            print(f"f_insert_biz_opp()에서의 v_formatted_sql : {v_formatted_sql}")


            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_insert_biz_opp_detail,v_param_insert_biz_opp_detail)
            v_sql_insert_biz_opp_history = """INSERT INTO ajict_bms_schema.biz_opp_history (biz_opp_id,
                                                                                            history_no,
                                                                                            biz_opp_name,
                                                                                            progress1_rate_code,
                                                                                            progress2_rate_code,
                                                                                            contract_date,
                                                                                            essential_achievement_tf,
                                                                                            renewal_code,
                                                                                            create_user)
                                                                                           VALUES (%s,
                                                                                                   1,
                                                                                                   %s,
                                                                                                   'PRO',
                                                                                                   %s,
                                                                                                   %s,
                                                                                                   %s,
                                                                                                   'I',
                                                                                                   %s)"""
            v_param_insert_biz_opp_history = []
            v_param_insert_biz_opp_history.append(v_biz_opp_id)
            v_param_insert_biz_opp_history.append(v_biz_opp_name)
            v_param_insert_biz_opp_history.append(v_progress2_rate_code)
            v_param_insert_biz_opp_history.append(v_contract_date)
            v_param_insert_biz_opp_history.append(v_body.get('biz_opp',{}).get('a_essential_achievement_tf'))
            v_param_insert_biz_opp_history.append(v_session_user_id)


            test
            v_formatted_sql = v_sql_insert_biz_opp_history % tuple(map(repr,v_param_insert_biz_opp_history))
            print(f"f_insert_biz_opp()에서의 v_formatted_sql : {v_formatted_sql}")


            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_insert_biz_opp_history,v_param_insert_biz_opp_history)
            v_sql_insert_biz_opp_detail_history = """INSERT INTO ajict_bms_schema.biz_opp_detail_history (biz_opp_id,
                                                                                                          detail_no,
                                                                                                          history_no,
                                                                                                          user_id,
                                                                                                          change_preparation_dept_id,
                                                                                                          change_preparation_dept_name,
                                                                                                          last_client_com1_code,
                                                                                                          last_client_com2_code,
                                                                                                          sale_com1_code,
                                                                                                          sale_com2_code,
                                                                                                          sale_item_no,
                                                                                                          sale_date,
                                                                                                          sale_amt,
                                                                                                          sale_profit,
                                                                                                          purchase_date,
                                                                                                          purchase_amt,
                                                                                                          collect_money_date,
                                                                                                          biz_section1_code,
                                                                                                          biz_section2_code,
                                                                                                          principal_product1_code,
                                                                                                          principal_product2_code,
                                                                                                          create_user)
                                                                                                         VALUES (%s,
                                                                                                                 1,
                                                                                                                 1,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 (SELECT A.dept_name FROM ajict_bms_schema.dept A WHERE A.dept_id = %s AND A.delete_date IS NULL),
                                                                                                                 'COR',
                                                                                                                 %s,
                                                                                                                 'COR',
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 %s,
                                                                                                                 'BIZ',
                                                                                                                 %s,
                                                                                                                 'COR',
                                                                                                                 %s,
                                                                                                                 %s)"""
            v_param_insert_biz_opp_detail_history = []
            v_param_insert_biz_opp_detail_history.append(v_biz_opp_id)
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_param_insert_biz_opp_detail_history.append(v_user_id)
            else:
               v_param_insert_biz_opp_detail_history.append(v_session_user_id)
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_param_insert_biz_opp_detail_history.append(v_change_preparation_dept_id)
            else:
               v_param_insert_biz_opp_detail_history.append(v_dept_id)
            if v_auth1_code == 'AUT' and v_auth2_code == '0001':
               v_param_insert_biz_opp_detail_history.append(v_change_preparation_dept_id)
            else:
               v_param_insert_biz_opp_detail_history.append(v_dept_id)
            v_param_insert_biz_opp_detail_history.append(v_last_client_com2_code)
            v_param_insert_biz_opp_detail_history.append(v_sale_com2_code)
            v_param_insert_biz_opp_detail_history.append(v_sale_item_no)
            v_param_insert_biz_opp_detail_history.append(v_sale_date)
            v_param_insert_biz_opp_detail_history.append(v_sale_amt)
            v_param_insert_biz_opp_detail_history.append(v_sale_profit)
            v_param_insert_biz_opp_detail_history.append(v_purchase_date)
            v_param_insert_biz_opp_detail_history.append(v_purchase_amt)
            v_param_insert_biz_opp_detail_history.append(v_collect_money_date)
            v_param_insert_biz_opp_detail_history.append(v_biz_section2_code)
            v_param_insert_biz_opp_detail_history.append(v_principal_product2_code)
            v_param_insert_biz_opp_detail_history.append(v_session_user_id)


            test
            v_formatted_sql = v_sql_insert_biz_opp_detail_history % tuple(map(repr,v_param_insert_biz_opp_detail_history))
            print(f"f_insert_biz_opp()에서의 v_formatted_sql : {v_formatted_sql}")


            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_insert_biz_opp_detail_history,v_param_insert_biz_opp_detail_history)
            v_sql_insert_biz_opp_activity = """INSERT INTO ajict_bms_schema.biz_opp_activity (biz_opp_id,
                                                                                              detail_no,
                                                                                              activity_no,
                                                                                              activity_details,
                                                                                              activity_date,
                                                                                              create_user)
                                                                                             VALUES (%s,
                                                                                                     1,
                                                                                                     1,
                                                                                                     %s,
                                                                                                     %s,
                                                                                                     %s)"""
            v_param_insert_biz_opp_activity = []
            v_param_insert_biz_opp_activity.append(v_biz_opp_id)
            v_activity_details = None if v_body.get('biz_opp_activity',{}).get('a_activity_details') == '' else v_body.get('biz_opp_activity',{}).get('a_activity_details')
            if not v_activity_details:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'활동 내역' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_activity.append(v_activity_details)
            v_activity_date = None if v_body.get('biz_opp_activity',{}).get('a_activity_date') == '' else v_body.get('biz_opp_activity',{}).get('a_activity_date')
            if not v_activity_date:
               transaction.set_rollback(True)
               v_return = {'STATUS':'FAIL','MESSAGE':"'활동 일자' 항목은 필수 입력(선택) 항목입니다!"}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
            else:
               v_param_insert_biz_opp_activity.append(v_activity_date)
            v_param_insert_biz_opp_activity.append(v_session_user_id)


            test
            v_formatted_sql = v_sql_insert_biz_opp_activity % tuple(map(repr,v_param_insert_biz_opp_activity))
            print(f"f_insert_biz_opp()에서의 v_formatted_sql : {v_formatted_sql}")


            with connection.cursor() as v_cursor:
               v_cursor.execute(v_sql_insert_biz_opp_activity,v_param_insert_biz_opp_activity)
               v_return = {'STATUS':'SUCCESS','MESSAGE':"저장되었습니다."}
               v_square_bracket_return = [v_return]
               return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except Exception as E:
         v_return = {'STATUS':'FAIL','MESSAGE':'오류가 발생했습니다.','ERROR':str(E)}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})

#def f_renewal_biz_opp(request)

def f_delete_biz_opp(request):
   v_session_user_id = ''
   v_body = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_param_delete_biz_opp = []
         v_param_delete_biz_opp_detail = []
         v_param_delete_biz_opp_history = []
         v_param_delete_biz_opp_detail_history = []
         v_param_delete_biz_opp_activity = []
         with transaction.atomic():
            v_sql_delete_biz_opp = """UPDATE ajict_bms_schema.biz_opp SET delete_user = %s,delete_date = CURRENT_TIMESTAMP WHERE biz_opp_id = %s AND delete_date IS NULL"""
            v_param_delete_biz_opp.append(v_session_user_id)
            v_biz_opp_id = None if v_body.get('biz_opp',{}).get('a_biz_opp_id') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_id')
            if v_biz_opp_id is not None:
               v_biz_opp_id = v_biz_opp_id.strip()
            v_param_delete_biz_opp.append(v_biz_opp_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_delete_biz_opp,v_param_delete_biz_opp)
            v_sql_delete_biz_opp_detail = """UPDATE ajict_bms_schema.biz_opp_detail SET delete_user = %s,delete_date = CURRENT_TIMESTAMP WHERE biz_opp_id = %s AND delete_date IS NULL"""
            v_param_delete_biz_opp_detail.append(v_session_user_id)
            v_biz_opp_id = None if v_body.get('biz_opp',{}).get('a_biz_opp_id') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_id')
            if v_biz_opp_id is not None:
               v_biz_opp_id = v_biz_opp_id.strip()
            v_param_delete_biz_opp_detail.append(v_biz_opp_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_delete_biz_opp_detail,v_param_delete_biz_opp_detail)
            v_sql_delete_biz_opp_history = """UPDATE ajict_bms_schema.biz_opp_history SET delete_user = %s,delete_date = CURRENT_TIMESTAMP WHERE biz_opp_id = %s AND delete_date IS NULL"""
            v_param_delete_biz_opp_history.append(v_session_user_id)
            v_biz_opp_id = None if v_body.get('biz_opp',{}).get('a_biz_opp_id') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_id')
            if v_biz_opp_id is not None:
               v_biz_opp_id = v_biz_opp_id.strip()
            v_param_delete_biz_opp_history.append(v_biz_opp_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_delete_biz_opp_history,v_param_delete_biz_opp_history)
            v_sql_delete_biz_opp_detail_history = """UPDATE ajict_bms_schema.biz_opp_detail_history SET delete_user = %s,delete_date = CURRENT_TIMESTAMP WHERE biz_opp_id = %s AND delete_date IS NULL"""
            v_param_delete_biz_opp_detail_history.append(v_session_user_id)
            v_biz_opp_id = None if v_body.get('biz_opp',{}).get('a_biz_opp_id') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_id')
            if v_biz_opp_id is not None:
               v_biz_opp_id = v_biz_opp_id.strip()
            v_param_delete_biz_opp_detail_history.append(v_biz_opp_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_delete_biz_opp_detail_history,v_param_delete_biz_opp_detail_history)
            v_sql_delete_biz_opp_activity = """UPDATE ajict_bms_schema.biz_opp_activity SET delete_user = %s,delete_date = CURRENT_TIMESTAMP WHERE biz_opp_id = %s AND delete_date IS NULL"""
            v_param_delete_biz_opp_activity.append(v_session_user_id)
            v_biz_opp_id = None if v_body.get('biz_opp',{}).get('a_biz_opp_id') == '' else v_body.get('biz_opp',{}).get('a_biz_opp_id')
            if v_biz_opp_id is not None:
               v_biz_opp_id = v_biz_opp_id.strip()
            v_param_delete_biz_opp_activity.append(v_biz_opp_id)
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_delete_biz_opp_activity,v_param_delete_biz_opp_activity)
            v_return = {'STATUS':'SUCCESS','MESSAGE':"저장되었습니다."}
            v_square_bracket_return = [v_return]
            return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except Exception as E:
         v_return = {'STATUS':'FAIL','MESSAGE':'오류가 발생했습니다.','ERROR':str(E)}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
def f_select_biz_opp_activity1(request):
   v_session_user_id = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_sql_session = """SELECT user_id,
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
                                       delete_date IS NULL"""
         v_param1 = []
         v_param1.append(v_session_user_id)
         v_auth1_code = ''
         v_auth2_code = ''
         v_responsibility1_code = ''
         v_responsibility2_code = ''
         v_user_id = ''
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_session,v_param1)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data_session = [dict(zip(v_columns,row)) for row in v_rows]
            v_auth1_code = v_data_session[0]['auth1_code']
            v_auth2_code = v_data_session[0]['auth2_code']
            v_responsibility1_code = v_data_session[0]['responsibility1_code']
            v_responsibility2_code = v_data_session[0]['responsibility2_code']
            v_user_id = v_data_session[0]['user_id']
            v_dept_id = v_data_session[0]['dept_id']
         v_data = {"search_headquarters":[],"search_team":[],"retrieve_biz_opp_activity":[]}
         v_sql_headquarters = """SELECT * FROM ajict_bms_schema.dept WHERE LENGTH(dept_id) = 5 AND delete_date IS NULL ORDER BY dept_id"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_headquarters)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_headquarters"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_team = """SELECT * FROM ajict_bms_schema.dept WHERE LENGTH(dept_id) = 4 AND delete_date IS NULL ORDER BY dept_id"""
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_team)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["search_team"] = [dict(zip(v_columns,row)) for row in v_rows]
         v_sql_biz_opp_activity = """SELECT A.biz_opp_id,
                                            A.biz_opp_name,
                                            B.user_id,
                                            (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = B.user_id AND AA.delete_date IS NULL) AS user_name,
                                            B.change_preparation_dept_id,
                                            B.change_preparation_dept_name,
                                            B.last_client_com1_code,
                                            B.last_client_com2_code,
                                            (SELECT DISTINCT BB.great_classi_name
                                             FROM ajict_bms_schema.commonness_code BB
                                             WHERE BB.great_classi_code = B.last_client_com1_code AND
                                                   BB.delete_date IS NULL) AS last_client_com1_name,
                                            (SELECT CC.small_classi_name
                                             FROM ajict_bms_schema.commonness_code CC
                                             WHERE CC.great_classi_code = B.last_client_com1_code AND
                                                   CC.small_classi_code = B.last_client_com2_code AND
                                                   CC.delete_date IS NULL) AS last_client_com2_name,
                                            B.sale_com1_code,
                                            B.sale_com2_code,
                                            (SELECT DISTINCT DD.great_classi_name
                                             FROM ajict_bms_schema.commonness_code DD
                                             WHERE DD.great_classi_code = B.sale_com1_code AND
                                                   DD.delete_date IS NULL) AS sale_com1_name,
                                            (SELECT EE.small_classi_name
                                             FROM ajict_bms_schema.commonness_code EE
                                             WHERE EE.great_classi_code = B.sale_com1_code AND
                                                   EE.small_classi_code = B.sale_com2_code AND
                                                   EE.delete_date IS NULL) AS sale_com2_name,
                                            A.contract_date,
                                            A.progress1_rate_code,
                                            A.progress2_rate_code,
                                            (SELECT DISTINCT NN.great_classi_name
                                             FROM ajict_bms_schema.commonness_code NN
                                             WHERE NN.great_classi_code = A.progress1_rate_code AND
                                                   NN.delete_date IS NULL) AS progress1_rate_name,
                                            (SELECT OO.small_classi_name
                                             FROM ajict_bms_schema.commonness_code OO
                                             WHERE OO.great_classi_code = A.progress1_rate_code AND
                                                   OO.small_classi_code = A.progress2_rate_code AND
                                                   OO.delete_date IS NULL) AS progress2_rate_name,
                                            B.sale_item_no,
                                            B.sale_date,
                                            B.sale_amt,
                                            B.sale_profit,
                                            B.purchase_date,
                                            B.purchase_amt,
                                            B.collect_money_date,
                                            B.biz_section1_code,
                                            B.biz_section2_code,
                                            (SELECT DISTINCT FF.great_classi_name
                                             FROM ajict_bms_schema.commonness_code FF
                                             WHERE FF.great_classi_code = B.biz_section1_code AND
                                                   FF.delete_date IS NULL) AS biz_section1_name,
                                            (SELECT GG.small_classi_name
                                             FROM ajict_bms_schema.commonness_code GG
                                             WHERE GG.great_classi_code = B.biz_section1_code AND
                                                   GG.small_classi_code = B.biz_section2_code AND
                                                   GG.delete_date IS NULL) AS biz_section2_name,
                                            A.essential_achievement_tf,
                                            B.principal_product1_code,
                                            B.principal_product2_code,
                                            (SELECT DISTINCT HH.great_classi_name
                                             FROM ajict_bms_schema.commonness_code HH
                                             WHERE HH.great_classi_code = B.principal_product1_code AND
                                                   HH.delete_date IS NULL) AS product1_name,
                                            (SELECT II.small_classi_name
                                             FROM ajict_bms_schema.commonness_code II
                                             WHERE II.great_classi_code = B.principal_product1_code AND
                                                   II.small_classi_code = B.principal_product2_code AND
                                                   II.delete_date IS NULL) AS product2_name,
                                            (SELECT JJ.dept_id
                                             FROM ajict_bms_schema.aj_user JJ
                                             WHERE JJ.user_id = B.user_id AND
                                                   JJ.delete_date IS NULL) AS dept_id,
                                            (SELECT KK.high_dept_id FROM ajict_bms_schema.dept KK WHERE KK.dept_id = B.change_preparation_dept_id AND KK.delete_date IS NULL) AS high_dept_id,
                                            (SELECT LL.dept_name
                                             FROM ajict_bms_schema.dept LL
                                             WHERE LL.dept_id = (SELECT BBB.dept_id
                                                                 FROM ajict_bms_schema.aj_user BBB
                                                                 WHERE BBB.user_id = B.user_id AND
                                                                       BBB.delete_date IS NULL) AND
                                                  LL.delete_date IS NULL) AS dept_name,
                                            (SELECT MM.dept_name
                                             FROM ajict_bms_schema.dept MM
                                             WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                                                 FROM ajict_bms_schema.dept CCC
                                                                 WHERE CCC.dept_id = B.change_preparation_dept_id AND
                                                                       CCC.delete_date IS NULL) AS high_dept_name,
                                            C.activity_no,
                                            C.activity_details,
                                            C.activity_date,
                                            A.create_user AS biz_opp_create_user,
                                            A.create_date AS biz_opp_create_date,
                                            A.update_user AS biz_opp_update_user,
                                            A.update_date AS biz_opp_update_date,
                                            A.delete_user AS biz_opp_delete_user,
                                            A.delete_date AS biz_opp_delete_date,
                                            B.create_user AS biz_opp_detail_create_user,
                                            B.create_date AS biz_opp_detail_create_date,
                                            B.update_user AS biz_opp_detail_update_user,
                                            B.update_date AS biz_opp_detail_update_date,
                                            B.delete_user AS biz_opp_detail_delete_user,
                                            B.delete_date AS biz_opp_detail_delete_date,
                                            C.create_user AS biz_opp_activity_create_user,
                                            C.create_date AS biz_opp_activity_create_date,
                                            C.update_user AS biz_opp_activity_update_user,
                                            C.update_date AS biz_opp_activity_update_date,
                                            C.delete_user AS biz_opp_activity_delete_user,
                                            C.delete_date AS biz_opp_activity_delete_date
                                     FROM ajict_bms_schema.biz_opp A,
                                          ajict_bms_schema.biz_opp_detail B,
                                          ajict_bms_schema.biz_opp_activity C
                                     WHERE 1 = 1 AND
                                           A.biz_opp_id = B.biz_opp_id AND
                                           A.biz_opp_id = C.biz_opp_id AND
                                           B.detail_no = C.detail_no AND
                                           A.delete_date IS NULL AND
                                           B.delete_date IS NULL AND
                                           C.delete_date IS NULL"""
#                                  A.contract_date BETWEEN %s AND %s AND
#                                  B.sale_date BETWEEN %s AND %s"""
         v_param2 = []
#         v_current_year = datetime.now().year
#         v_contract_from_date = str(v_current_year) + '0101'
#         v_param2.append(v_contract_from_date)
#         v_contract_to_date = str(datetime.now().strftime('%Y%m%d'))
#         v_param2.append(v_contract_to_date)
#         v_sale_from_date = v_contract_from_date
#         v_param2.append(v_sale_from_date)
#         v_sale_to_date = v_contract_to_date
#         v_param2.append(v_sale_to_date)
         if v_auth1_code == 'AUT' and v_auth2_code == '0003':
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0003':
               v_sql_biz_opp_activity += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
               v_param2.append(v_dept_id)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0002':
               v_sql_biz_opp_activity += " AND B.change_preparation_dept_id = %s"
               v_param2.append(v_dept_id)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0001':
               v_sql_biz_opp_activity += " AND B.user_id = %s"
               v_param2.append(v_user_id)
         v_sql_biz_opp_activity += " ORDER BY A.biz_opp_id,\
                                              C.detail_no,\
                                              C.activity_no"


         #test
         v_formatted_sql = v_sql_biz_opp_activity % tuple(map(repr,v_param2))
         print(f"f_select_biz_opp_activity1()에서의 v_formatted_sql : {v_formatted_sql}")


         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_opp_activity,v_param2)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["retrieve_biz_opp_activity"] = [dict(zip(v_columns,row)) for row in v_rows]
            if not v_data["retrieve_biz_opp_activity"]:
               v_status = {"STATUS":"NONE","MESSAGE":"Data가 존재하지 않습니다."}
            else:
               v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
         return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params={'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})
def f_select_biz_opp_activity2(request):
   v_session_user_id = ''
   v_body = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_sql_session = """SELECT user_id,
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
                                       delete_date IS NULL"""
         v_param1 = []
         v_param1.append(v_session_user_id)
         v_auth1_code = ''
         v_auth2_code = ''
         v_responsibility1_code = ''
         v_responsibility2_code = ''
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_session,v_param1)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data_session = [dict(zip(v_columns,row)) for row in v_rows]
            v_auth1_code = v_data_session[0]['auth1_code']
            v_auth2_code = v_data_session[0]['auth2_code']
            v_responsibility1_code = v_data_session[0]['responsibility1_code']
            v_responsibility2_code = v_data_session[0]['responsibility2_code']
         v_contract_date_from = None if v_body.get('a_contract_date_from') == '' else v_body.get('a_contract_date_from')
         if v_contract_date_from is not None:
            v_contract_date_from = v_contract_date_from.strip()
         v_contract_date_to = None if v_body.get('a_contract_date_to') == '' else v_body.get('a_contract_date_to')
         if v_contract_date_to is not None:
            v_contract_date_to = v_contract_date_to.strip()
         v_sale_date_from = None if v_body.get('a_sale_date_from') == '' else v_body.get('a_sale_date_from')
         if v_sale_date_from is not None:
            v_sale_date_from = v_sale_date_from.strip()
         v_sale_date_to = None if v_body.get('a_sale_date_to') == '' else v_body.get('a_sale_date_to')
         if v_sale_date_to is not None:
            v_sale_date_to = v_sale_date_to.strip()
         v_headquarters_dept_id = None if v_body.get('a_headquarters_dept_id') == '' else v_body.get('a_headquarters_dept_id')
         if v_headquarters_dept_id is not None:
            v_headquarters_dept_id = v_headquarters_dept_id.strip()
         v_team_dept_id = None if v_body.get('a_dept_id') == '' else v_body.get('a_dept_id')
         if v_team_dept_id is not None:
            v_team_dept_id = v_team_dept_id.strip()
         v_user_name = None if v_body.get('a_user_name') == '' else v_body.get('a_user_name')
         if v_user_name is not None:
            v_user_name = v_user_name.strip()
         v_sql_biz_opp_activity = """SELECT A.biz_opp_id,
                                            A.biz_opp_name,
                                            B.user_id,
                                            (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = B.user_id AND AA.delete_date IS NULL) AS user_name,
                                            B.change_preparation_dept_id,
                                            B.change_preparation_dept_name,
                                            B.last_client_com1_code,
                                            B.last_client_com2_code,
                                            (SELECT DISTINCT BB.great_classi_name
                                             FROM ajict_bms_schema.commonness_code BB
                                             WHERE BB.great_classi_code = B.last_client_com1_code AND
                                                   BB.delete_date IS NULL) AS last_client_com1_name,
                                            (SELECT CC.small_classi_name
                                             FROM ajict_bms_schema.commonness_code CC
                                             WHERE CC.great_classi_code = B.last_client_com1_code AND
                                                   CC.small_classi_code = B.last_client_com2_code AND
                                                   CC.delete_date IS NULL) AS last_client_com2_name,
                                            B.sale_com1_code,
                                            B.sale_com2_code,
                                            (SELECT DISTINCT DD.great_classi_name
                                             FROM ajict_bms_schema.commonness_code DD
                                             WHERE DD.great_classi_code = B.sale_com1_code AND
                                                   DD.delete_date IS NULL) AS sale_com1_name,
                                            (SELECT EE.small_classi_name
                                             FROM ajict_bms_schema.commonness_code EE
                                             WHERE EE.great_classi_code = B.sale_com1_code AND
                                                   EE.small_classi_code = B.sale_com2_code AND
                                                   EE.delete_date IS NULL) AS sale_com2_name,
                                            A.contract_date,
                                            A.progress1_rate_code,
                                            A.progress2_rate_code,
                                            (SELECT DISTINCT NN.great_classi_name
                                             FROM ajict_bms_schema.commonness_code NN
                                             WHERE NN.great_classi_code = A.progress1_rate_code AND
                                                   NN.delete_date IS NULL) AS progress1_rate_name,
                                            (SELECT OO.small_classi_name
                                             FROM ajict_bms_schema.commonness_code OO
                                             WHERE OO.great_classi_code = A.progress1_rate_code AND
                                                   OO.small_classi_code = A.progress2_rate_code AND
                                                   OO.delete_date IS NULL) AS progress2_rate_name,
                                            B.sale_item_no,
                                            B.sale_date,
                                            B.sale_amt,
                                            B.sale_profit,
                                            B.purchase_date,
                                            B.purchase_amt,
                                            B.collect_money_date,
                                            B.biz_section1_code,
                                            B.biz_section2_code,
                                            (SELECT DISTINCT FF.great_classi_name
                                             FROM ajict_bms_schema.commonness_code FF
                                             WHERE FF.great_classi_code = B.biz_section1_code AND
                                                   FF.delete_date IS NULL) AS biz_section1_name,
                                            (SELECT GG.small_classi_name
                                             FROM ajict_bms_schema.commonness_code GG
                                             WHERE GG.great_classi_code = B.biz_section1_code AND
                                                   GG.small_classi_code = B.biz_section2_code AND
                                                   GG.delete_date IS NULL) AS biz_section2_name,
                                            A.essential_achievement_tf,
                                            B.principal_product1_code,
                                            B.principal_product2_code,
                                            (SELECT DISTINCT HH.great_classi_name
                                             FROM ajict_bms_schema.commonness_code HH
                                             WHERE HH.great_classi_code = B.principal_product1_code AND
                                                   HH.delete_date IS NULL) AS product1_name,
                                            (SELECT II.small_classi_name
                                             FROM ajict_bms_schema.commonness_code II
                                             WHERE II.great_classi_code = B.principal_product1_code AND
                                                   II.small_classi_code = B.principal_product2_code AND
                                                   II.delete_date IS NULL) AS product2_name,
                                            (SELECT JJ.dept_id
                                             FROM ajict_bms_schema.aj_user JJ
                                             WHERE JJ.user_id = B.user_id AND
                                                   JJ.delete_date IS NULL) AS dept_id,
                                            (SELECT KK.high_dept_id FROM ajict_bms_schema.dept KK WHERE KK.dept_id = B.change_preparation_dept_id AND KK.delete_date IS NULL) AS high_dept_id,
                                            (SELECT LL.dept_name
                                             FROM ajict_bms_schema.dept LL
                                             WHERE LL.dept_id = (SELECT BBB.dept_id
                                                                 FROM ajict_bms_schema.aj_user BBB
                                                                 WHERE BBB.user_id = B.user_id AND
                                                                       BBB.delete_date IS NULL) AND
                                                   LL.delete_date IS NULL) AS dept_name,
                                            (SELECT MM.dept_name
                                             FROM ajict_bms_schema.dept MM
                                             WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                                                 FROM ajict_bms_schema.dept CCC
                                                                 WHERE CCC.dept_id = B.change_preparation_dept_id AND
                                                                       CCC.delete_date IS NULL) AS high_dept_name,
                                            C.activity_no,
                                            C.activity_details,
                                            C.activity_date,
                                            A.create_user AS biz_opp_create_user,
                                            A.create_date AS biz_opp_create_date,
                                            A.update_user AS biz_opp_update_user,
                                            A.update_date AS biz_opp_update_date,
                                            A.delete_user AS biz_opp_delete_user,
                                            A.delete_date AS biz_opp_delete_date,
                                            B.create_user AS biz_opp_detail_create_user,
                                            B.create_date AS biz_opp_detail_create_date,
                                            B.update_user AS biz_opp_detail_update_user,
                                            B.update_date AS biz_opp_detail_update_date,
                                            B.delete_user AS biz_opp_detail_delete_user,
                                            B.delete_date AS biz_opp_detail_delete_date,
                                            C.create_user AS biz_opp_activity_create_user,
                                            C.create_date AS biz_opp_activity_create_date,
                                            C.update_user AS biz_opp_activity_update_user,
                                            C.update_date AS biz_opp_activity_update_date,
                                            C.delete_user AS biz_opp_activity_delete_user,
                                            C.delete_date AS biz_opp_activity_delete_date
                                     FROM ajict_bms_schema.biz_opp A,
                                          ajict_bms_schema.biz_opp_detail B,
                                          ajict_bms_schema.biz_opp_activity C
                                     WHERE 1 = 1 AND
                                           A.biz_opp_id = B.biz_opp_id AND
                                           A.biz_opp_id = C.biz_opp_id AND
                                           B.detail_no = C.detail_no AND
                                           A.delete_date IS NULL AND
                                           B.delete_date IS NULL AND
                                           C.delete_date IS NULL"""
         v_param2 = []
         if not v_contract_date_from:
            v_contract_date_from = '19500101'
         if not v_contract_date_to:
            v_contract_date_to = '20401231'
         if not v_sale_date_from:
            v_sale_date_from = '19500101'
         if not v_sale_date_to:
            v_sale_date_to = '20401231'
         v_sql_biz_opp_activity += " AND A.contract_date BETWEEN %s AND %s"
         v_param2.append(v_contract_date_from)
         v_param2.append(v_contract_date_to)
         v_sql_biz_opp_activity += " AND B.sale_date BETWEEN %s AND %s"
         v_param2.append(v_sale_date_from)
         v_param2.append(v_sale_date_to)
         if v_auth1_code == 'AUT' and (v_auth2_code == '0001' or v_auth2_code == '0002'):
            if v_headquarters_dept_id:
               if v_headquarters_dept_id == '97100' or v_headquarters_dept_id == '97200':
                  v_sql_biz_opp_activity += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
               else:
                  v_sql_biz_opp_activity += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 2) || '%%'"
               v_param2.append(v_headquarters_dept_id)
            if v_team_dept_id:
               v_sql_biz_opp_activity += " AND B.change_preparation_dept_id = %s"
               v_param2.append(v_team_dept_id)
            if v_user_name:
               v_sql_biz_opp_activity += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
               v_param2.append(v_user_name)
         if v_auth1_code == 'AUT' and v_auth2_code == '0003':
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0003':
               if v_headquarters_dept_id and not v_team_dept_id:
                  v_sql_biz_opp_activity += " AND B.change_preparation_dept_id LIKE SUBSTRING(%s FROM 1 FOR 3) || '%%'"
                  v_param2.append(v_headquarters_dept_id)
               if v_headquarters_dept_id and v_team_dept_id:
                  v_sql_biz_opp_activity += " AND B.change_preparation_dept_id = %s"
                  v_param2.append(v_team_dept_id)
               if v_user_name:
                  v_sql_biz_opp_activity += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
                  v_param2.append(v_user_name)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0002':
               if v_team_dept_id:
                  v_sql_biz_opp_activity += " AND B.change_preparation_dept_id = %s"
                  v_param2.append(v_team_dept_id)
               if v_user_name:
                  v_sql_biz_opp_activity += " AND B.user_id IN (SELECT PP.user_id FROM ajict_bms_schema.aj_user PP WHERE PP.user_name LIKE '%%' || %s ||'%%' AND PP.delete_date IS NULL)"
                  v_param2.append(v_user_name)
            if v_responsibility1_code == 'RES' and v_responsibility2_code == '0001':
               v_sql_biz_opp_activity += " AND B.user_id = %s"
               v_param2.append(v_session_user_id)
         v_sql_biz_opp_activity += " ORDER BY A.biz_opp_id,\
                                              C.detail_no,\
                                              C.activity_no"
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_opp_activity,v_param2)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data = [dict(zip(v_columns,row)) for row in v_rows]
            if not v_data:
               v_status = {"STATUS":"NONE","MESSAGE":"Data가 존재하지 않습니다."}
            else:
               v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
            return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params = {'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
def f_select_biz_opp_history(request):
   v_session_user_id = ''
   v_body = ''
   if request.method == 'POST':
      v_body = json.loads(request.body)
      v_session_user_id = None if v_body.get('a_session_user_id') == '' else v_body.get('a_session_user_id')
      if v_session_user_id is not None:
         v_session_user_id = v_session_user_id.strip()
   if not v_session_user_id:
      v_return = {'STATUS':'FAIL','MESSAGE':'a_session_user_id를 전달 받지 못했습니다.'}
      v_square_bracket_return = [v_return]
      return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
   else:
      try:
         v_data = {"retrieve_biz_opp_history":[]}
         v_biz_opp_id = None if v_body.get('a_biz_opp_id') == '' else v_body.get('a_biz_opp_id')
         v_sql_biz_opp_history = """SELECT A.biz_opp_id,
                                           A.history_no,
                                           A.biz_opp_name,
                                           A.u_biz_opp_name,
                                           B.user_id,
                                           (SELECT AA.user_name FROM ajict_bms_schema.aj_user AA WHERE AA.user_id = B.user_id AND AA.delete_date IS NULL) AS user_name,
                                           B.change_preparation_dept_id,
                                           B.change_preparation_dept_name,
                                           B.last_client_com1_code,
                                           B.last_client_com2_code,
                                           B.u_last_client_com2_code,
                                           (SELECT DISTINCT BB.great_classi_name
                                            FROM ajict_bms_schema.commonness_code BB
                                            WHERE BB.great_classi_code = B.last_client_com1_code AND
                                                  BB.delete_date IS NULL) AS last_client_com1_name,
                                           (SELECT CC.small_classi_name
                                            FROM ajict_bms_schema.commonness_code CC
                                            WHERE CC.great_classi_code = B.last_client_com1_code AND
                                                  CC.small_classi_code = B.last_client_com2_code AND
                                                  CC.delete_date IS NULL) AS last_client_com2_name,
                                           B.sale_com1_code,
                                           B.sale_com2_code,
                                           B.u_sale_com2_code,
                                           (SELECT DISTINCT DD.great_classi_name
                                            FROM ajict_bms_schema.commonness_code DD
                                            WHERE DD.great_classi_code = B.sale_com1_code AND
                                                  DD.delete_date IS NULL) AS sale_com1_name,
                                           (SELECT EE.small_classi_name
                                            FROM ajict_bms_schema.commonness_code EE
                                            WHERE EE.great_classi_code = B.sale_com1_code AND
                                                  EE.small_classi_code = B.sale_com2_code AND
                                                  EE.delete_date IS NULL) AS sale_com2_name,
                                           A.contract_date,
                                           A.u_contract_date,
                                           A.progress1_rate_code,
                                           A.progress2_rate_code,
                                           A.u_progress2_rate_code,
                                           (SELECT DISTINCT NN.great_classi_name
                                            FROM ajict_bms_schema.commonness_code NN
                                            WHERE NN.great_classi_code = A.progress1_rate_code AND
                                                  NN.delete_date IS NULL) AS progress1_rate_name,
                                           (SELECT OO.small_classi_name
                                            FROM ajict_bms_schema.commonness_code OO
                                            WHERE OO.great_classi_code = A.progress1_rate_code AND
                                                  OO.small_classi_code = A.progress2_rate_code AND
                                                  OO.delete_date IS NULL) AS progress2_rate_name,
                                           B.sale_item_no,
                                           B.u_sale_item_no,
                                           B.sale_date,
                                           B.u_sale_date,
                                           B.sale_amt,
                                           B.u_sale_amt,
                                           B.sale_profit,
                                           B.u_sale_profit,
                                           B.purchase_date,
                                           B.u_purchase_date,
                                           B.purchase_amt,
                                           B.u_purchase_amt,
                                           B.collect_money_date,
                                           B.u_collect_money_date,
                                           B.biz_section1_code,
                                           B.biz_section2_code,
                                           B.u_biz_section2_code,
                                           (SELECT DISTINCT FF.great_classi_name
                                            FROM ajict_bms_schema.commonness_code FF
                                            WHERE FF.great_classi_code = B.biz_section1_code AND
                                                  FF.delete_date IS NULL) AS biz_section1_name,
                                           (SELECT GG.small_classi_name
                                            FROM ajict_bms_schema.commonness_code GG
                                            WHERE GG.great_classi_code = B.biz_section1_code AND
                                                  GG.small_classi_code = B.biz_section2_code AND
                                                  GG.delete_date IS NULL) AS biz_section2_name,
                                           A.essential_achievement_tf,
                                           A.u_essential_achievement_tf,
                                           B.principal_product1_code,
                                           B.principal_product2_code,
                                           B.u_principal_product2_code,
                                           (SELECT DISTINCT HH.great_classi_name
                                            FROM ajict_bms_schema.commonness_code HH
                                            WHERE HH.great_classi_code = B.principal_product1_code AND
                                                  HH.delete_date IS NULL) AS product1_name,
                                           (SELECT II.small_classi_name
                                            FROM ajict_bms_schema.commonness_code II
                                            WHERE II.great_classi_code = B.principal_product1_code AND
                                                  II.small_classi_code = B.principal_product2_code AND
                                                  II.delete_date IS NULL) AS product2_name,
                                           (SELECT JJ.dept_id
                                            FROM ajict_bms_schema.aj_user JJ
                                            WHERE JJ.user_id = B.user_id AND
                                                  JJ.delete_date IS NULL) AS dept_id,
                                           (SELECT KK.high_dept_id
                                            FROM ajict_bms_schema.dept KK
                                            WHERE KK.dept_id = (SELECT AAA.dept_id
                                                                FROM ajict_bms_schema.aj_user AAA
                                                                WHERE AAA.user_id = B.user_id AND
                                                                      AAA.delete_date IS NULL) AND
                                                  KK.delete_date IS NULL) AS high_dept_id,
                                           (SELECT LL.dept_name
                                            FROM ajict_bms_schema.dept LL
                                            WHERE LL.dept_id = (SELECT BBB.dept_id
                                                                FROM ajict_bms_schema.aj_user BBB
                                                                WHERE BBB.user_id = B.user_id AND
                                                                      BBB.delete_date IS NULL) AND
                                                 LL.delete_date IS NULL) AS dept_name,
                                           (SELECT MM.dept_name
                                            FROM ajict_bms_schema.dept MM
                                            WHERE MM.dept_id = (SELECT CCC.high_dept_id
                                                                FROM ajict_bms_schema.dept CCC
                                                                WHERE CCC.dept_id = (SELECT AAAA.dept_id
                                                                                     FROM ajict_bms_schema.aj_user AAAA
                                                                                     WHERE AAAA.user_id = B.user_id AND
                                                                                           AAAA.delete_date IS NULL) AND
                                                                      CCC.delete_date IS NULL) AND
                                                  MM.delete_date IS NULL) AS high_dept_name,
                                           A.renewal_code,
                                           CASE WHEN A.renewal_code = 'I'
                                                THEN (SELECT PP.create_date FROM ajict_bms_schema.biz_opp PP WHERE PP.biz_opp_id = A.biz_opp_id)
                                                WHEN A.renewal_code = 'U'
                                                THEN (SELECT QQ.update_date FROM ajict_bms_schema.biz_opp QQ WHERE QQ.biz_opp_id = A.biz_opp_id)
                                                WHEN A.renewal_code = 'D'
                                                THEN (SELECT RR.delete_date FROM ajict_bms_schema.biz_opp RR WHERE RR.biz_opp_id = A.biz_opp_id)
                                                ELSE NULL
                                            END AS renewal_date
                                    FROM ajict_bms_schema.biz_opp_history A,
                                         ajict_bms_schema.biz_opp_detail_history B
                                    WHERE 1 = 1 AND
                                          A.biz_opp_id = B.biz_opp_id AND
                                          A.biz_opp_id = %s"""
         v_param = []
         v_param.append(v_biz_opp_id)
         v_sql_biz_opp_history += " ORDER BY A.biz_opp_id,\
                                              B.detail_no,\
                                              B.history_no"
         with connection.cursor() as v_cursor:
            v_cursor.execute(v_sql_biz_opp_history,v_param)
            v_columns = [v_column[0] for v_column in v_cursor.description]
            v_rows = v_cursor.fetchall()
            v_data["retrieve_biz_opp_history"] = [dict(zip(v_columns,row)) for row in v_rows]
            if not v_data["retrieve_biz_opp_history"]:
               v_status = {"STATUS":"NONE","MESSAGE":"Data가 존재하지 않습니다."}
            else:
               v_status = {"STATUS":"SUCCESS","MESSAGE":"조회되었습니다."}
         return JsonResponse({"data":v_data,"status":v_status},safe = False,json_dumps_params={'ensure_ascii':False})
      except DatabaseError:
         v_return = {'STATUS':'FAIL','MESSAGE':'DB에서 오류가 발생했습니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params = {'ensure_ascii':False})
      except json.JSONDecodeError:
         v_return = {'STATUS':'JSON','MESSAGE':'JSON의 format가 틀립니다.'}
         v_square_bracket_return = [v_return]
         return JsonResponse(v_square_bracket_return,safe = False,json_dumps_params={'ensure_ascii':False})