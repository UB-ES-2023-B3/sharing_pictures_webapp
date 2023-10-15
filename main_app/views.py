from .models import Post
from .forms import UploadPostForm
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.contrib import messages


def load_pictures(request):
    
    posts = Post.objects.all()
    picture_data = []

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
            return load_pictures(request) 
        else:
            return HttpResponseBadRequest("Form validation failed")
    else:
        load_pictures(request) 


