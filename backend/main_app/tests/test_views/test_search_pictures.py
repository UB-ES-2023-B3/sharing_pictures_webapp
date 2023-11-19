# backend/main_app/tests/test_views/test_search_pictures.py
from django.test import TestCase, Client
from django.urls import reverse
from backend.main_app.models import Post, CustomUser
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

class SearchPicturesViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.search_pictures_url = reverse('search_pictures')  
        user = CustomUser.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword123')
        
        # Create posts with varying descriptions
        for i in range(5):
            Post.objects.create(
                user=user,
                image=SimpleUploadedFile(name=f'test_image_{i}.jpg', content=b'some image content', content_type='image/jpeg'),
                description=f'Test description with keyword {i}',
                created_at=timezone.now()
            )

    def test_search_pictures_success(self):
        response = self.client.get(self.search_pictures_url, {'q': 'keyword'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('pictures' in response.json())
        self.assertGreater(len(response.json()['pictures']), 0)

    def test_search_pictures_empty_query(self):
        response = self.client.get(self.search_pictures_url, {'q': ''})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['pictures']), Post.objects.count())

    def test_search_pictures_no_match(self):
        response = self.client.get(self.search_pictures_url, {'q': 'nonexistent'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['pictures']), 0)


