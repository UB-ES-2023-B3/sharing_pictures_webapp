# backend/main_app/tests/test_views/test_login.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from backend.main_app.forms import LoginForm

User = get_user_model()

class LoginViewTest(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('login')  
        # Create a user for testing login
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='Testpassword123!')

    def test_login_view_post_success(self):
        data = {
            'username': 'testuser@example.com',
            'password': 'Testpassword123!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('_auth_user_id' in self.client.session)

    def test_login_view_post_invalid(self):
        data = {
            'username': 'testuser@example.com',
            'password': 'Wrongpassword!'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse('_auth_user_id' in self.client.session)

    def test_login_view_get_request(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 400)

# Add more tests as needed for other scenarios
