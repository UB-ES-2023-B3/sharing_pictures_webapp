from django.urls import path, re_path
from .views import index


urlpatterns = [
   # path('', index, name='index'),
    path('register/',index),
    path('profile/<str:pk>',index),
    path('',index),
    path('login/',index),
    path('search_results/',index),
    path('viewImage/',index),
    path('moderation_panel/',index),
]