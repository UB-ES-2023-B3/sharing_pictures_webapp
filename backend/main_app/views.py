import json
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from .forms import RegistrationForm, LoginForm
from .decorators import user_not_authenticated
from .models import Post
from .models import Comment
from .models import CustomUser
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegistrationForm, LoginForm, UploadPostForm
from .models import Post, Profile, FollowersCount, CustomUser
from django.core.cache import cache
from django.core.serializers import serialize
import os

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


#TODO logout
@login_required
def log_out(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("/")
        

#@user_not_authenticated
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
                return HttpResponse(status=201)

        else:
            for error in list(form.errors.values()):
                messages.error(request, error)
            return HttpResponse(status=400)
    else:
        return HttpResponse(status=400)

#TODO logout
#@login_required
def log_out(request):
    logout(request)
    return JsonResponse({"status": "success"}) 

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
                    'post_id' : post.id,
                })

    return JsonResponse({'pictures': picture_data}, safe=False)

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




def search(request):
    """
    Search for profiles based on a query string in their associated CustomUser username.
    """
    query = request.GET.get('q', '')  # Get the query parameter named 'q' from the request.
    
    if not query:
        return JsonResponse({'error': 'Query parameter is missing'}, status=400)
    
    profiles_starting_with_query = Profile.objects.filter(user__username__istartswith=query)
    profiles_containing_query = Profile.objects.filter(user__username__icontains=query).exclude(pk__in=profiles_starting_with_query.values('pk'))
    combined_profiles = (list(profiles_starting_with_query) + list(profiles_containing_query))
    profile_data = [{'id': profile.id, 'username': profile.user.username, 'profileimg': profile.profileimg.url} for profile in combined_profiles]
    
    return JsonResponse({'profiles': profile_data}, safe=False)

def search_pictures(request):
    import random

    # Get the word from the request (assuming it's a GET parameter named 'word')
    word = request.GET.get('q', '')

    # Filter the posts by descriptions that contain the word
    posts = Post.objects.filter(description__icontains=word)

    picture_data = []

    # Shuffle the posts to get a random order
    posts = list(posts)
    random.shuffle(posts)
  
    for post in posts:
        picture_data.append({
            'image_url': post.image.url,
            'description': post.description,
            'created_at': post.created_at.strftime('%F %d, %Y'),
            'image_size': post.image.size,
        })

    # if not picture_data:
    #     return JsonResponse({'error': 'No posts found.'}, status=404)
    return JsonResponse({'pictures': picture_data}, safe=False)



def profile(request, pk):
    # Check if the requested username matches the authenticated user
    is_own_profile = (request.user.username == pk)
    
    user_object = CustomUser.objects.get(username=pk) 
   
   
    #handle error if the user does not exist
    if not user_object: 
        print("**********does not exist*******")
    if not user_object: 
        print("**********does not exist*******")
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


    return JsonResponse(context, safe=False)

def get_logged_in_user(request):
    if request.user.is_authenticated:
        user = request.user
        return JsonResponse({'username': user.username})
    else:
        return JsonResponse({'message': 'No user logged in'})


def like(request):

    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
        user_object = CustomUser.objects.get(username=user_username) 

        if not user_object:
            return HttpResponse(status=404, content="User not found")
    
        user_profile = Profile.objects.get(user=user_object)

        post_id = post_data.get('post_id')
        post = Post.objects.get(id=post_id)
        if user_profile.likes.filter(id=post.id).exists():
            user_profile.likes.remove(post)
            user_profile.save()
            return HttpResponse(status=201)
        
        else:
            user_profile.likes.add(post)
            user_profile.save()
            return HttpResponse(status=201)
        
    return HttpResponse(status=400)

def get_is_liked(request):
    
    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
       
        user_object = CustomUser.objects.get(username=user_username) 
       
        if not user_object:
            return HttpResponse(status=404, content="User not found")
    
        user_profile = Profile.objects.get(user=user_object)

        post_id = post_data.get('post_id')
        post = Post.objects.get(id=post_id)
        if user_profile.likes.filter(id=post.id).exists():

             return JsonResponse({'message':'Sacar like'})
        
        else:
            
            
             return JsonResponse({'message':'añadir like'})
        
    return HttpResponse(status=400)

def follow(request):

    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
        user_object = CustomUser.objects.get(username=user_username) 

        if not user_object:
            return HttpResponse(status=404, content="User1 not found")
    
        user_profile = Profile.objects.get(user=user_object)

        user_name = post_data['user']
        user = CustomUser.objects.get(username=user_name)
        if not user:
            return HttpResponse(status=404, content="User2 not found")
        if user_profile.following.filter(username=user.username).exists():
            user_profile.following.remove(user)
            unfollow = FollowersCount.objects.get(follower=user_username, user = user_name)
            unfollow.delete()
            user_profile.save()
            #unfollow.save()
            return HttpResponse(status=201)
        
        else:
            user_profile.following.add(user)
            follow = FollowersCount.objects.create(user = user_name, follower = user_username)
            user_profile.save()
            follow.save()
            return HttpResponse(status=201)
        
    return HttpResponse(status=400)

def get_is_user_following(request):
    
    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
        user_object = CustomUser.objects.get(username=user_username) 

        if not user_object:
            return HttpResponse(status=404, content="User1 not found")
    
        user_profile = Profile.objects.get(user=user_object)

        user_name = post_data['user']
        user = CustomUser.objects.get(username=user_name)
        if not user:
            return HttpResponse(status=404, content="User2 not found")
        if user_profile.following.filter(username=user.username).exists():
             return JsonResponse({'message':'Follow'})
        
        else:
             return JsonResponse({'message':'Unfollow'})
        
    return HttpResponse(status=400)

def getOwnerPost(request):
    if request.method == 'POST':
        post_data = json.loads(request.body)
        post_id = post_data.get('post_id')
        post = Post.objects.get(id=post_id)

        return JsonResponse({'message': post.user.username})
    else:
        return HttpResponse(status=400)

def update_profile(request):
    if request.method == 'POST':
        # Pasem a JSON el contingut del cos de la petició
        post_data = json.loads(request.body.decode('utf-8'))

        user_object = CustomUser.objects.get(username=request.user.username)
        user_profile = Profile.objects.get(user=user_object)

        bio = post_data.get('bio')

        if bio and len(bio) > 100:
            return HttpResponse(status=400, content="Bio too long")

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

            #check if the file is an image and size less than 4MB and only type png, jpg or jpeg

            if not profileimg.content_type.startswith('image/'):
                return HttpResponse(status=400, content="File is not an image")

            if profileimg.size > 4 * 1024 * 1024:
                return HttpResponse(status=400, content="File is too big")

            if not profileimg.name.endswith('.png') and not profileimg.name.endswith('.jpg') and not profileimg.name.endswith('.jpeg'):
                return HttpResponse(status=400, content="File is not a png, jpg or jpeg")


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

def load_following_pictures(request):
    
    user_object = CustomUser.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=user_object)
    following = user_profile.following.all()
    posts = Post.objects.filter(user__in=following)
    picture_data = []

    #order the posts by date the most recent first
    posts = posts.order_by('-created_at')
    
    for post in posts:
        picture_data.append({
                    'image_url': post.image.url,
                    'description': post.description,
                    'created_at': post.created_at.strftime('%F %d, %Y'),
                    'image_size': post.image.size,
                    'post_id' : post.id,
                })
        
    print(picture_data)

    return JsonResponse({'pictures': picture_data}, safe=False)
    
def load_liked_pictures(request):
    import random
    user_object = CustomUser.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=user_object)
    posts = user_profile.likes.all()
    picture_data = []

    
    posts = list(posts)

    random.shuffle(posts)


    for post in posts:
        picture_data.append({
                    'image_url': post.image.url,
                    'description': post.description,
                    'created_at': post.created_at.strftime('%F %d, %Y'),
                    'image_size': post.image.size,
                    'post_id' : post.id,
                })
        

    return JsonResponse({'pictures': picture_data}, safe=False)


def get_avatar(request):

    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
        user_object = CustomUser.objects.get(username=user_username) 

        if not user_object:
            return HttpResponse(status=404, content="User1 not found")
    
        user_profile = Profile.objects.get(user=user_object)


        return JsonResponse({'avatar':user_profile.profileimg.name,
                             'email': user_object.email})
    else:
        return HttpResponse(status=400)
def upload_comment(request):
    if request.method == 'POST':
        post_data = json.loads(request.body.decode('utf-8'))
        post_id = post_data['post_id']
        comment_text = post_data['comment']
        user = post_data['username']
        user_object = CustomUser.objects.get(username=user) 
        if not user_object:
            return HttpResponse(status=404, content="User not found")
        
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.create(user=user_object, content=comment_text)
        post.comments.add(comment)
        comment.save()
        post.save()
        return JsonResponse({'message': 'Comment uploaded successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
def getCommentsOfPost(request):
    if request.method == 'POST':
        post_data = json.loads(request.body.decode('utf-8'))
        post_id = post_data['post_id']
        post = Post.objects.get(id=post_id)
        # Obtener los comentarios del post
        comments = post.comments.all()

        # Crear una lista de diccionarios con la información de cada comentario
        comments_list = []
        for comment in comments:
            user = comment.user.username
            user_object = CustomUser.objects.get(username=user) 
            user_profile = Profile.objects.get(user=user_object)
            comment_info = {
                'id': comment.id,
                'user': user,
                'content': comment.content,
                'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'avatar': user_profile.profileimg.name
            }
            comments_list.append(comment_info)

        # Devolver la lista de comentarios en la respuesta JSON
        return JsonResponse({'comments': comments_list})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
def delete_comment(request):
    if request.method == 'POST':
        post_data = json.loads(request.body.decode('utf-8'))
        post_id = post_data['post_id']
        comment_id = post_data['comment_id']
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.get(id=comment_id)
        if post.comments.filter(id=comment.id).exists():
            post.comments.remove(comment)
            post.save()
            comment.delete()
            return JsonResponse({'message': 'Comment delete successfully'}, status=201)
        else:
            return JsonResponse({'error': 'No exist the comment on this post'}, status=400)
    else: 
        return JsonResponse({'error': 'Invalid request method'}, status=400)


def get_avatar(request):

    if request.method == 'POST':
        post_data = json.loads(request.body)
        user_username =post_data['username']
        user_object = CustomUser.objects.get(username=user_username) 

        if not user_object:
            return HttpResponse(status=404, content="User1 not found")
    
        user_profile = Profile.objects.get(user=user_object)


        return JsonResponse({'avatar':user_profile.profileimg.name,
                             'email': user_object.email})
    else:
        return HttpResponse(status=400)