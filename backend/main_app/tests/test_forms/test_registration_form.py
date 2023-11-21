# backend/main_app/tests/test_forms/test_registration_form.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from backend.main_app.forms import RegistrationForm

User = get_user_model()

class RegistrationFormTest(TestCase):

    def test_form_validity(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'Testpassword123!',
            'password2': 'Testpassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        form = RegistrationForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_saves_correctly(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'Testpassword123!',
            'password2': 'Testpassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        form = RegistrationForm(data=form_data)
        if form.is_valid():
            user = form.save()
            self.assertIsNotNone(user.pk)  # User has been saved to the database
            self.assertEqual(user.email, 'test@example.com')
            self.assertEqual(user.username, 'testuser')
            self.assertEqual(user.first_name, 'Test')
            self.assertEqual(user.last_name, 'User')
        else:
            self.fail('The form should be valid but is not.')

    def test_email_field_required(self):
        form_data = {
            'email': '',
            'username': 'testuser',
            'password1': 'Testpassword123!',
            'password2': 'Testpassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        form = RegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    def test_password_not_valid(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        form = RegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())


    def test_password_mismatch(self):
        form_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password1': 'Testpassword123!',
            'password2': 'Wrongpassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        form = RegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)
