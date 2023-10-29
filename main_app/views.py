import json
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .forms import RegistrationForm, LoginForm
from .decorators import user_not_authenticated
from .models import Post
from .models import CustomUser

#US1.1

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegistrationForm, LoginForm, UploadPostForm
from .models import Post, Profile, FollowersCount, CustomUser
from django.core.cache import cache
from django.core.serializers import serialize
import os



#US1.1
#@user_not_authenticated
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user_model = CustomUser.objects.get(email=user.email)
            new_profile = Profile.objects.create(user=user_model, id_user=user_model.id)
            new_profile.save()
            login(request, user)
            return  HttpResponse('You have singed up successfully.',status=201)

        else:
            #for error in list(form.errors.values()):
            errors = [str(error) for error in form.errors.keys()]
            return JsonResponse({'errors':form.errors}, status=400)
    else:
        form = RegistrationForm()
        return render(request, 'register', {'form': form})

#US2.1


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

def search(request):
    """
    Search for users based on a query string in their username.
    """
    query = request.GET.get('q', '')  # Get the query parameter named 'q' from the request.
    
    if not query:
        return JsonResponse({'error': 'Query parameter is missing'}, status=400)
    
    users_starting_with_query = CustomUser.objects.filter(username__istartswith=query)
    users_containing_query = CustomUser.objects.filter(username__icontains=query).exclude(pk__in=users_starting_with_query.values('pk'))
    combined_users = (list(users_starting_with_query) + list(users_containing_query))
    user_data = [{'id': user.id, 'username': user.username} for user in combined_users]
    
    
    # If no users or pictures match the search query
    if not user_data:
        return JsonResponse({'error': 'No results found for the given query.'}, status=404)
    
    return JsonResponse({'users': user_data}, safe=False)



def search(request):
    """
    Search for users based on a query string in their username.
    """
    query = request.GET.get('q', '')  # Get the query parameter named 'q' from the request.
    
    if not query:
        return JsonResponse({'error': 'Query parameter is missing'}, status=400)
    
    users_starting_with_query = CustomUser.objects.filter(username__istartswith=query)
    users_containing_query = CustomUser.objects.filter(username__icontains=query).exclude(pk__in=users_starting_with_query.values('pk'))
    combined_users = (list(users_starting_with_query) + list(users_containing_query))
    user_data = [{'id': user.id, 'username': user.username} for user in combined_users]
    
    
    # If no users or pictures match the search query
    if not user_data:
        return JsonResponse({'error': 'No results found for the given query.'}, status=404)
    
    return JsonResponse({'users': user_data}, safe=False)



def profile(request, pk):
    # Comprobar si el perfil es del usuario logueado
    is_own_profile = (request.user.username == pk)
    
    # Cogemos la información de perfil del usuario
    user_object = CustomUser.objects.get(username=pk) 
    
    if not user_object:
        return HttpResponse(status=404, content="User not found")
    
    user_profile = Profile.objects.get(user=user_object)
    follower = request.user.username

    user_followers = len(FollowersCount.objects.filter(user=user_object))
    user_following = len(FollowersCount.objects.filter(follower=pk))

    # Serialize the CustomUser model to JSON
    user_object_json = serialize('json', [user_object])

    # Parse the serialized data to convert it into a Python dictionary
    user_object_data = json.loads(user_object_json)

    #the same serialization with the profile
    user_profile_json = serialize('json', [user_profile])

    # Parse the serialized data to convert it into a Python dictionary
    user_profile_data = json.loads(user_profile_json)

    context = {
        'user_object': user_object_data[0],  # Extract the first item from the serialized data
        'user_profile': user_profile_data[0],
        'profile_image': os.path.basename(user_profile_data[0]['fields']['profileimg']), 
        'user_followers': user_followers,
        'user_following': user_following,
        'is_own_profile': is_own_profile,
    }

    return JsonResponse(context, safe=False)