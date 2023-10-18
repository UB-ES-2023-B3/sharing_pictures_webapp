from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .forms import RegistrationForm, LoginForm
from .decorators import user_not_authenticated
from .models import Post

#US1.1

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegistrationForm, LoginForm
from .decorators import user_not_authenticated
from .models import Post
from .forms import UploadPostForm

#US1.1
#@user_not_authenticated
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            #messages.success(request, 'You have singed up successfully.')
            #login(request)
            return  HttpResponse('You have singed up successfully.',status=201)

        else:
            #for error in list(form.errors.values()):
            errors = [str(error) for error in form.errors.keys()]
            return JsonResponse({'errors':form.errors}, status=400)
    else:
        form = RegistrationForm()
        return render(request, 'register', {'form': form})

#US2.1
@user_not_authenticated
def log_in(request):
    if request.method == "POST":
        form = LoginForm(request=request, data=request.POST)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data["username"],
                password=form.cleaned_data["password"],
            )
            if user is not None:
                login(request, user)
                messages.success(request, f"Hello <b>{user.username}</b>! You have been logged in")
                return redirect("/")

        else:
            for error in list(form.errors.values()):
                messages.error(request, error)

    form = LoginForm()


    return render(request, 'main_app/login.html', {'form': form})

#USX.X (logout)
@login_required
def log_out(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("/")
        

#US2.1
#@user_not_authenticated
def log_in(request):
    if request.method == "POST":
        form = LoginForm(request=request, data=request.POST)
        print(form.data)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data["username"],
                password=form.cleaned_data["password"],
            )
            if user is not None:
                login(request, user)
                print("201")
                return HttpResponse(status=201)

        else:
            for error in list(form.errors.values()):
                messages.error(request, error)
            print("400-1")
            return HttpResponse(status=400)
    else:
        print("400-2")
        return HttpResponse(status=400)

#USX.X (logout)
#@login_required
def log_out(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("/")

def load_pictures(request):
    import random #import random module
    posts = Post.objects.all()
    picture_data = []

    #shuffle the posts to get a random order
    posts = list(posts)
    random.shuffle(posts)
  
    for post in posts:
        picture_data.append({
                    'image_url': post.image.url,
                    'description': post.description,
                    'created_at': post.created_at.strftime('%F %d, %Y'),
                    'image_size': post.image.size,
                })

    return JsonResponse({'pictures': picture_data}, safe=False)

def upload_picture(request):
    if request.method == 'POST':
        form = UploadPostForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "error", "errors": form.errors}, status=400)
    else:
        load_pictures(request)
