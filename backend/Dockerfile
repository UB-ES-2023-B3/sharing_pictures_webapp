FROM python:3.11.6

ENV PYTHONUNBUFFERED 1

ENV PATH="${PATH}:/root/.local/bin"
ENV PYTHONPATH=.

WORKDIR /app

COPY requirements.txt /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY db.sqlite3 /app
COPY ./frontend ./frontend
COPY ./main_app ./main_app

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "127.0.0.1:8080"]