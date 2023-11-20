# backend/main_app/tests/test_views/test_register.py
from django.test import TestCase, Client
from django.urls import reverse
from backend.main_app.models import CustomUser, Profile
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')  
    def test_register_view_post_success(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'Testpassword123!',
            'password2': 'Testpassword123!',
            'first_name': 'New',
            'last_name' : 'User'

        }
        response = self.client.post(self.register_url, data)
        if response.status_code != 201:
            print(response.json())
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CustomUser.objects.filter(email='newuser@example.com').exists())
        self.assertTrue(Profile.objects.filter(user__email='newuser@example.com').exists())
        self.assertTrue('_auth_user_id' in self.client.session)

    def test_register_view_post_invalid(self):
        data = {
            'username': 'newuser',
            'email': 'invalidemail',  # Invalid email
            'password1': 'Testpassword123!',
            'password2': 'Testpassword123!',
            'first_name': 'New',
            'last_name' : 'User'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(CustomUser.objects.filter(email='invalidemail').exists())
        self.assertIn('email', response.json()['errors'])

