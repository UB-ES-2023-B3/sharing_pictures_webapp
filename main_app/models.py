from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime
import uuid

#US1.1, US2.1
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    image = models.ImageField(upload_to='post_images')
    description = models.TextField(default='')
    created_at = models.DateTimeField(default=datetime.now)
