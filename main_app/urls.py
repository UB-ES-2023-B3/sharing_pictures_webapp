from django.urls import path
from . import views

urlpatterns = [
<<<<<<< HEAD
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),
=======
    path('load_more_pictures/', views.load_more_pictures, name='load_more_pictures')
>>>>>>> US3.1---FRONTEND
]