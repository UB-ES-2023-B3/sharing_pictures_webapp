from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'), #US1.1
    path('login/', views.sign_in, name='login'), #US2.1
    path('logout/', views.sign_out, name='logout'), #USX.X (logout)
]