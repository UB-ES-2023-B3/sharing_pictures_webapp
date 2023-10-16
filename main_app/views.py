from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegistrationForm, UserLoginForm
from .decorators import user_not_authenticated
from django.http import HttpResponse
#US1.1
@user_not_authenticated
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
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
        form = UserRegistrationForm()
        return render(request, 'register', {'form': form})

#US2.1
@user_not_authenticated
def login(request):
    if request.method == "POST":
        form = UserLoginForm(request=request, data=request.POST)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data["username"],
                password=form.cleaned_data["password"],
            )
            if user is not None:
                login(request, user)
                return redirect("/")

        else:
            for error in list(form.errors.values()):
                messages.error(request, error)

    form = UserLoginForm()


    return render(request, 'login', {'form': form})

#USX.X (logout)
@login_required
def logout(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("/")
from django.shortcuts import render
from .models import Post
from django.http import JsonResponse


def index(request):
    posts = list(Post.objects.all())

    extended_posts = []

    for i in range(12):
        extended_posts.extend(posts)

    return render(request, 'login', {'posts': extended_posts})


def load_more_pictures(request):

    more_pictures = Post.objects.all()
    picture_data = []

    for post in more_pictures:
        # Convert each Post object to a dictionary
        for i in range(12):
            picture_data.append({
                'image_url': post.image.url,
                'description': post.description,
                'created_at': post.created_at.strftime('%F %d, %Y'),
            })

    return JsonResponse({'pictures': picture_data}, safe=False)
