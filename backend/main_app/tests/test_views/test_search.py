# backend/main_app/tests/test_views/test_search.py
from django.test import TestCase, Client
from django.urls import reverse
from backend.main_app.models import CustomUser, Profile
from django.core.files.uploadedfile import SimpleUploadedFile

class SearchViewTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.search_url = reverse('search')  # Replace 'search' with your URL name
        # Create test users and profiles
        for i in range(5):
            user = CustomUser.objects.create_user(username=f'testuser{i}', email=f'testuser{i}@example.com', password='testpassword123')
            Profile.objects.create(
                user=user,
                id_user=user.id,
                profileimg=SimpleUploadedFile(name=f'test_image_{i}.jpg', content=b'some image content', content_type='image/jpeg')
            )

    def test_search_success(self):
        response = self.client.get(self.search_url, {'q': 'testuser'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('profiles' in response.json())
        self.assertGreater(len(response.json()['profiles']), 0)

    def test_search_empty_query(self):
        response = self.client.get(self.search_url, {'q': ''})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_search_no_match(self):
        response = self.client.get(self.search_url, {'q': 'nonexistent'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('profiles' in response.json())
        self.assertEqual(len(response.json()['profiles']), 0)

