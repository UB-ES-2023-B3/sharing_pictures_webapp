from django.shortcuts import render
from .models import Post
from django.http import JsonResponse


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
