from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
    

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.content}'    

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    image = models.ImageField(upload_to='post_images')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    description = models.TextField(default='')
    
    comments = models.ManyToManyField(Comment, related_name='post_comments')
    created_at = models.DateTimeField(default=timezone.now)

class Profile(models.Model):

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    id_user = models.IntegerField()
    bio = models.TextField(blank=True, default='')
    profileimg = models.ImageField(upload_to='profile_images',
                                    default='blank-profile-picture.png')
    likes = models.ManyToManyField(Post, related_name='user_posts')
    following = models.ManyToManyField(CustomUser, related_name='user_following')

    def __str__(self):
        return self.user.username
    
class FollowersCount(models.Model):

    follower = models.CharField(max_length=100)
    user = models.CharField(max_length=100)

    def __str__(self):
        return self.user
    
class Reports(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    description = models.TextField(default='')
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f'{self.user.username} - {self.post.id}'
    

class UserReports(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reported_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reported_user')
    description = models.TextField(default='')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} - {self.reported_user.username}'