from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

# US1.1
class RegisterForm(UserCreationForm):
    class Meta:
        model=User
        fields = ['username','email','password1','password2']

# US2.1
class LoginForm(forms.Form):
    username = forms.CharField(max_length=65)
    password = forms.CharField(max_length=65, widget=forms.PasswordInput)