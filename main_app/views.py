import json
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .forms import RegistrationForm, LoginForm
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


    #lo comentado es para más adelante si hay muchas fotografias!!

    # Agafem la llista de les imatges que ja s'han vist de la sessió
    #pictures_seen = request.session.get('pictures_seen', [])

    # Agafem la llista de les imatges que no s'han vist de la sessió 
    #posts = Post.objects.exclude(id__in=pictures_seen).order_by('-created_at')[:10]

    posts = Post.objects.all().order_by('?')[:10]
    
    new_pictures = []

    for post in posts:
        new_pictures.append({
            'image_url': post.image.url,
            'description': post.description,
            'created_at': post.created_at.strftime('%F %d, %Y'),
            'image_size': post.image.size,
            'id': str(post.id),  # Convert the UUID to a string
        })

        # Afegeix l'identificador de la imatge a la llista de les imatges vistes
        #pictures_seen.append(str(post.id))

    # Actualitza la llista de les imatges vistes a la sessió
    #request.session['pictures_seen'] = pictures_seen

    return JsonResponse({'pictures': new_pictures}, safe=False)

def upload_picture(request):
    if request.method == 'POST':
        form = UploadPostForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.user = request.user
            form.save()
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "error", "errors": form.errors}, status=400)
    else:
        load_pictures(request)

def profile(request, pk):
    # Check if the requested username matches the authenticated user
    is_own_profile = (request.user.username == pk)
    
    user_object = CustomUser.objects.get(username=pk) 

    #handle error if the user does not exist
    if not user_object:
        return HttpResponse(status=404, content="User not found")
    
    user_profile = Profile.objects.get(user=user_object)
    follower = request.user.username
    
    uloaded_posts = Post.objects.filter(user=user_object).order_by('-created_at')

    if FollowersCount.objects.filter(follower=follower, user=user_object).first():
        button_text = 'Unfollow'
    else:
        button_text = 'Follow'

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

    #the same with the posts of the user
    uloaded_posts_json = serialize('json', uloaded_posts)

    # Parse the serialized data to convert it into a Python dictionary
    uloaded_posts = json.loads(uloaded_posts_json)

    context = {
        'user_object': user_object_data[0],  # Extract the first item from the serialized data
        'user_profile': user_profile_data[0],
        'button_text': button_text,
        'profile_image': os.path.basename(user_profile_data[0]['fields']['profileimg']),  # Include the .url to access the URL
        'user_followers': user_followers,
        'user_following': user_following,
        'is_own_profile': is_own_profile,
    }

    if uloaded_posts:
        context['uploaded_posts'] = uloaded_posts

    print("--------------------------------------")
    print("\n", context, "\n")

    return JsonResponse(context, safe=False)

def update_profile(request):
    if request.method == 'POST':
        # Pasem a JSON el contingut del cos de la petició
        post_data = json.loads(request.body.decode('utf-8'))

        user_object = CustomUser.objects.get(username=request.user.username)
        user_profile = Profile.objects.get(user=user_object)

        bio = post_data.get('bio')
        user_profile.bio = bio

        first_name = post_data.get('first_name')
        user_object.first_name = first_name

        last_name = post_data.get('last_name')
        user_object.last_name = last_name

        user_profile.save()
        user_object.save()
        return HttpResponse(status=201)
    else:
        return HttpResponse(status=400)
    

def update_profile_picture(request):
    if request.method == 'POST':
        # Check if the request has a file in it
        if 'profileimg' in request.FILES:
            profileimg = request.FILES['profileimg']

            user_object = CustomUser.objects.get(username=request.user.username)
            user_profile = Profile.objects.get(user=user_object)

            # Assuming you want to save the uploaded image directly to the user's profile
            user_profile.profileimg = profileimg
            user_profile.save()

            # Devuelve solo el nombre del archivo
            response_data = {'profileimg': profileimg.name}
            return JsonResponse(response_data, status=201)
        else:
            return JsonResponse({'error': 'No profileimg provided in the request'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
def follow(request, pk):

    if request.method == 'POST':
        
        user_to_follow = CustomUser.objects.get(username=pk)

        follower = request.user.username

        if FollowersCount.objects.filter(follower=follower, user=user_to_follow).first():
            FollowersCount.objects.filter(follower=follower, user=user_to_follow).delete()
            return HttpResponse(status=201)
        
        else:
            new_follower = FollowersCount.objects.create(follower=follower, user=user_to_follow)
            new_follower.save()
            return HttpResponse(status=201)
        
    return HttpResponse(status=400)