from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .forms import RegistrationForm, LoginForm
from .decorators import user_not_authenticated
from .models import Post

#US1.1
@user_not_authenticated
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'You have singed up successfully.')
            login(request, user)
            return redirect('/')

        else:
            for error in list(form.errors.values()):
                print(request, error)
    else:
        form = RegistrationForm()
    return render(request, 'main_app/register.html', {'form': form})

#US2.1
@user_not_authenticated
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
                return HttpResponse(201)

        else:
            for error in list(form.errors.values()):
                messages.error(request, error)
            return HttpResponse(400)
    else:
        return HttpResponse(400)

#USX.X (logout)
@login_required
def log_out(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("/")

def index(request):
    posts = list(Post.objects.all())

    extended_posts = []

    for i in range(12):
        extended_posts.extend(posts)

    return render(request, 'index.html', {'posts': extended_posts})

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