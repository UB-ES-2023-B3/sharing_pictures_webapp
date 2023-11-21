# backend/main_app/tests/test_models/test_post.py
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from backend.main_app.models import Post, CustomUser
from django.utils import timezone
import uuid

class PostModelTest(TestCase):
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

    def test_id_field(self):
        # Test if the id field is a UUID field
        self.assertIsInstance(self.post.id, uuid.UUID)

    def test_image_field(self):
        # Test the image field is saved correctly
        # This will only check if the file path starts with 'post_images/test_image'
        # and ends with '.jpg', but not the random string part.
        self.assertTrue(self.post.image.name.startswith('post_images/test_image'))
        self.assertTrue(self.post.image.name.endswith('.jpg'))


    def test_user_field(self):
        # Test the user field is a foreign key to CustomUser
        self.assertEquals(self.post.user, self.user)

    def test_description_field(self):
        # Test the description field content
        self.assertEquals(self.post.description, 'A test description')


