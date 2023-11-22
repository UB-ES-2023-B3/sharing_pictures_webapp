# backend/main_app/tests/test_forms/test_login_form.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from backend.main_app.forms import LoginForm

User = get_user_model()

class LoginFormTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Create a user for authentication tests
        cls.user = User.objects.create_user(username='user@example.com', email='user@example.com', password='P@ssword123')

    def test_form_validity_with_correct_credentials(self):
        form_data = {'username': 'user@example.com', 'password': 'P@ssword123'}
        form = LoginForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_validity_with_incorrect_password(self):
        form_data = {'username': 'user@example.com', 'password': 'wrongpassword'}
        form = LoginForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_form_validity_with_nonexistent_user(self):
        form_data = {'username': 'nonexistent@example.com', 'password': 'P@ssword123'}
        form = LoginForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_custom_username_field_placeholder(self):
        form = LoginForm()
        self.assertEqual(form.fields['username'].widget.attrs['placeholder'], 'Email')

    def test_custom_password_field_placeholder(self):
        form = LoginForm()
        self.assertEqual(form.fields['password'].widget.attrs['placeholder'], 'Password')
