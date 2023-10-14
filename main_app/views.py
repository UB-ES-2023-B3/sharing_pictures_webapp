from .models import Post
from django.http import JsonResponse


def load_pictures(request):
    posts = Post.objects.all()
    picture_data = []

    for post in posts:
        for i in range(12):
            picture_data.append({
                'image_url': post.image.url,
                'description': post.description,
                'created_at': post.created_at.strftime('%F %d, %Y'),
                'image_size': post.image.size,
            })

    return JsonResponse({'pictures': picture_data}, safe=False)
