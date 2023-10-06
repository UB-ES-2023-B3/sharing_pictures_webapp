from django.db import models
from datetime import datetime
import uuid

# Create your models here.
class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    image = models.ImageField(upload_to='post_images')
    description = models.TextField()
    created_at = models.DateTimeField(default=datetime.now)