# backend/main_app/tests/test_views/test_load_pictures.py
from django.test import TestCase, Client
from django.urls import reverse
from backend.main_app.models import Post, CustomUser
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

class LoadPicturesViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.load_pictures_url = reverse('load_more_pictures')  

        # Create test user and posts
        user = CustomUser.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword123')
        for i in range(5):
            Post.objects.create(
                user=user,
                image=SimpleUploadedFile(name=f'test_image_{i}.jpg', content=b'some image content', content_type='image/jpeg'),
                description=f'Test description {i}',
                created_at=timezone.now()
            )

    def test_load_pictures_view(self):
        response = self.client.get(self.load_pictures_url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertIn('pictures', response.json())

        data = response.json()['pictures']
        self.assertEqual(len(data), Post.objects.count())

        # Verify that all posts are present in the response
        response_post_ids = {str(post['post_id']) for post in data}
        # Getting post IDs from the database
        db_post_ids = set(str(uuid) for uuid in Post.objects.values_list('id', flat=True))

        # Check if every ID in the response is present in the database
        self.assertEqual(response_post_ids, db_post_ids)

        # Test the structure of the response data for each post
        for post_data in data:
            self.assertIn('image_url', post_data)
            self.assertIn('description', post_data)
            self.assertIn('created_at', post_data)
            self.assertIn('image_size', post_data)
            self.assertIn('post_id', post_data)


