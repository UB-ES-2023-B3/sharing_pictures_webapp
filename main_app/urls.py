from django.urls import path
from . import views

urlpatterns = [
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),

]