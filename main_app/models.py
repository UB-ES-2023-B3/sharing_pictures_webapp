from django.contrib.auth.models import AbstractUser
from django.db import models

#US1.1, US2.1
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username