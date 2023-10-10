from django.urls import path
from . import views

urlpatterns = [
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),
    path('upload/', views.upload_picture, name='upload_picture')
]