from .models import Post
from .forms import UploadPostForm
from django.http import JsonResponse
from django.shortcuts import render, redirect

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


def upload_picture(request):
    if request.method == 'POST':
        form = UploadPostForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('load_more_pictures')
    else:
        form = UploadPostForm()
    return render(request, 'main_app/post_upload_template.html', {'form': form})