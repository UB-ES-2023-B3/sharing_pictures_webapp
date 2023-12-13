from django.test import TestCase
from django.utils import timezone
from backend.main_app.models import Reports, CustomUser, Post
from django.core.files.uploadedfile import SimpleUploadedFile

class ReportsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Create a user for the foreign key relationship
        cls.user = CustomUser.objects.create_user(email='testuser@example.com', username='testuser', password='12345')
        # Create a dummy image file
        cls.image = SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg')
        # Create a Post instance
        cls.post = Post.objects.create(
            image=cls.image,
            user=cls.user,
            description='A test description',
            created_at=timezone.now()
        )
        cls.report=  Reports.objects.create(
            user=cls.user,
            post=cls.post,
            description='This is a test report.',
            created_at=timezone.now()
        )

    def test_reports_model_str_method(self):
        expected_str = f'{self.user.username} - {self.post.id}'
        self.assertEqual(str(self.report), expected_str)

    def test_reports_model_fields(self):
        self.assertEqual(self.report.user, self.user)
        self.assertEqual(self.report.post, self.post)
        self.assertEqual(self.report.description, 'This is a test report.')
        self.assertIsNotNone(self.report.created_at)

    # Add more tests as needed for validation, unique constraints, etc.
