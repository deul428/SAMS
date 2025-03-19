# =========== 여기에 backend용 dockerfile을 작성해 주시면 됩니다. 아래 작성된 것은 제가 임의로 작성해 둔 것으로, 수정하셔서 사용하셔야 합니다. (버전 등에 맞게 설정 필) =========== 


# Python 3.9 기반 이미지 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 설치 (예: psycopg2 같은 패키지에 필요한 빌드 도구)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 복사
COPY backend/requirements.txt /app/

# Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 전체 백엔드 소스 코드 복사
COPY ./backend /app

# 환경 변수 설정 (예: 개발 모드)
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# 데이터베이스 마이그레이션과 개발 서버 실행
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
