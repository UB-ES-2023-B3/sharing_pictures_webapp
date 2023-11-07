FROM python:3.10
ENV PYTHONUNBUFFERED 1
#ENV DJANGO_SETTINGS_MODULE your_project.settings
ENV PATH="${PATH}:/root/.local/bin"
ENV PYTHONPATH=.

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app/
RUN pip install -r requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY src /app

EXPOSE 8000
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]