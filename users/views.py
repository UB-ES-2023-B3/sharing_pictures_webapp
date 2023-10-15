from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model, login, authenticate, logout
from .forms import LoginForm, UserRegistrationForm
from validate_email import validate_email

#US1.1
def register(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'You have singed up successfully.')
            login(request, user)
            return redirect('/')
        else:
            for error in list(form.errors.values()):
                print(request, error)

    if request.method == 'GET':
        form = UserRegistrationForm()
        return render(request, 'main_app/register.html', {'form': form})

    return render(request, 'main_app/register.html', {'form': form})

#US2.1
def sign_in(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('posts')

        form = LoginForm()
        return render(request, 'main_app/login.html', {'form': form})

    elif request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                messages.success(request, f'Hi {username.title()}, welcome back!')
                return redirect('posts')

        # either form not valid or user is not authenticated
        messages.error(request, f'Invalid username or password')
        return render(request, 'main_app/login.html', {'form': form})

#USX.X (logout)
def sign_out(request):
    logout(request)
    messages.success(request,f'You have been logged out.')
    return redirect('login')