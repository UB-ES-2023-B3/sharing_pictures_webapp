# backend/main_app/tests/test_models/test_custom_user.py
from django.test import TestCase
from django.core.exceptions import ValidationError
from backend.main_app.models import CustomUser

class CustomUserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = CustomUser.objects.create_user(email='testuser@example.com', username='testuser', password='12345')

    def test_email_label(self):
        field_label = self.user._meta.get_field('email').verbose_name
        self.assertEqual(field_label, 'email')

    def test_email_unique(self):
        unique = self.user._meta.get_field('email').unique
        self.assertTrue(unique)

    def test_username_label(self):
        field_label = self.user._meta.get_field('username').verbose_name
        self.assertEqual(field_label, 'username')

    def test_object_name_is_username(self):
        self.assertEqual(self.user.username, str(self.user))

    def test_required_fields(self):
        self.assertIn('username', CustomUser.REQUIRED_FIELDS)
        self.assertNotIn('email', CustomUser.REQUIRED_FIELDS)

    def test_user_creation_with_valid_email(self):
        self.assertEqual(self.user.email, 'testuser@example.com')

    def test_user_creation_with_invalid_email(self):
        with self.assertRaises(ValidationError):
            invalid_user = CustomUser.objects.create_user(email='not-an-email', username='testuser2', password='12345')
            invalid_user.full_clean()  # This will check for validation errors.
