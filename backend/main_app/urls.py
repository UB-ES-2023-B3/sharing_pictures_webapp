from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.log_in, name='login'),
    path('logout/', views.log_out, name='logout'), #TODO logout
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),
    path('upload/', views.upload_picture, name='upload_picture'),
    path('search/', views.search, name='search'),
    path('search_pictures/', views.search_pictures,name='search_pictures'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('likes/', views.like, name='likes'),
    path('get_logged_in_user/', views.get_logged_in_user, name='get_logged_in_user'),
    path('get_is_liked/', views.get_is_liked, name='get_is_liked'),
    path('follow/', views.follow, name='follow'),
    path('get_is_user_following/', views.get_is_user_following, name='get_is_user_following'),
    path('getOwnerPost/', views.getOwnerPost, name='getOwnerPost'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('update_profile_picture/', views.update_profile_picture, name='update_profile_picture'),
    path('upload_comment/', views.upload_comment, name='upload_comment'),
    path('getCommentsOfPost/', views.getCommentsOfPost, name='getCommentsOfPost'),
    path('deleteCommentPost/', views.delete_comment, name="deleteCommentPost"),
    path('load_liked_pictures/', views.load_liked_pictures, name='load_liked_pictures')
    ]
