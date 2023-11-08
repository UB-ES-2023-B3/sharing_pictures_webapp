FROM python:3.11.6

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "127.0.0.1:8080"]