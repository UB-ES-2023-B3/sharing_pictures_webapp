from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('load_more_pictures/', views.load_more_pictures, name='load_more_pictures'),
]