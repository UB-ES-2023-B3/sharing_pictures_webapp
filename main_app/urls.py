from django.urls import path
from . import views

urlpatterns = [
<<<<<<< HEAD
    path('register/', views.register, name='register'), #US1.1
    path('login/', views.log_in, name='login'), #US2.1
    path('logout/', views.log_out, name='logout'), #USX.X (logout)
    path('load_more_pictures/', views.load_more_pictures, name='load_more_pictures')
]
=======
    path('load_pictures/', views.load_pictures, name='load_more_pictures'),
    path('upload/', views.upload_picture, name='upload_picture'),


    ]
>>>>>>> origin/test
