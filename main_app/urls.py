from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'), #US1.1
    path('login/', views.log_in, name='login'), #US2.1
    path('logout/', views.log_out, name='logout'), #USX.X (logout)
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),
    path('upload/', views.upload_picture, name='upload_picture'),
    path('search/', views.search, name='search'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('likes/', views.like, name='likes'),
    path('get_logged_in_user/', views.get_logged_in_user, name='get_logged_in_user'),
    path('get_is_liked/', views.get_is_liked, name='get_is_liked'),

    
    path('update_profile/', views.update_profile, name='update_profile'),
    ]
