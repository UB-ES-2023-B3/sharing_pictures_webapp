# backend/main_app/tests/test_models/test_custom_user.py
from django.test import TestCase
from backend.main_app.models import CustomUser

class CustomUserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        CustomUser.objects.create_user(email='testuser@example.com', username='testuser', password='12345')

    def test_email_label(self):
        user = CustomUser.objects.get(id=1)
        field_label = user._meta.get_field('email').verbose_name
        self.assertEquals(field_label, 'email')

    def test_email_unique(self):
        user = CustomUser.objects.get(id=1)
        unique = user._meta.get_field('email').unique
        self.assertTrue(unique)

    def test_username_label(self):
        user = CustomUser.objects.get(id=1)
        field_label = user._meta.get_field('username').verbose_name
        self.assertEquals(field_label, 'username')

    def test_object_name_is_username(self):
        user = CustomUser.objects.get(id=1)
        expected_object_name = user.username
        self.assertEquals(expected_object_name, str(user))

    def test_required_fields(self):
        required_fields = CustomUser.REQUIRED_FIELDS
        self.assertTrue('username' in required_fields)
        self.assertFalse('email' in required_fields)