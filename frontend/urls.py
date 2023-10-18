from django.urls import path
from .views import index


urlpatterns = [
   # path('', index, name='index'),
    path('register/',index),
   
    path('',index),
    path('login/',index)
]