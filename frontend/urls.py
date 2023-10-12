
from django.urls import path
from .views import index,register


urlpatterns = [
   
    path('',index),
    path('register/',register)
]