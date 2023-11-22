# backend/main_app/tests/test_forms/test_upload_post_form.py
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from backend.main_app.forms import UploadPostForm
from backend.main_app.models import Post
from django.contrib.auth import get_user_model
from PIL import Image
import io

User = get_user_model()


class UploadPostFormTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='user@example.com', email='user@example.com', password='P@ssword123')
        # Create an image
        image = Image.new('RGB', (100, 100), color='red')  # Create a red image
        image_file = io.BytesIO()
        image.save(image_file, format='JPEG')
        image_file.seek(0)  # Important: go to the start of the BytesIO object

        cls.image = SimpleUploadedFile(name='test_image.jpg', content=image_file.read(), content_type='image/jpeg')
        cls.large_image = SimpleUploadedFile(name='large_test_image.jpg', content=b'a' * (100 * 1024 * 1024 + 1), content_type='image/jpeg')  # Just over 100MB

    def test_form_valid_with_image_and_description(self):
        form_data = {'description': 'A test description'}
        file_data = {'image': self.image}
        form = UploadPostForm(data=form_data, files=file_data)
        if not form.is_valid():
            print(form.errors)
        self.assertTrue(form.is_valid())

    def test_form_invalid_with_unsupported_image_extension(self):
        bad_image = SimpleUploadedFile(name='test_image.bmp', content=b'some image content', content_type='image/bmp')
        form_data = {'description': 'A test description'}
        file_data = {'image': bad_image}
        form = UploadPostForm(data=form_data, files=file_data)
        self.assertFalse(form.is_valid())
        self.assertIn('image', form.errors)

    def test_form_invalid_with_large_image_file(self):
        form_data = {'description': 'A test description'}
        file_data = {'image': self.large_image}
        form = UploadPostForm(data=form_data, files=file_data)
        self.assertFalse(form.is_valid())
        self.assertIn('image', form.errors)

    def test_form_valid_without_image(self):
        form_data = {'description': 'A test description'}
        form = UploadPostForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_form_save(self):
        form_data = {'description': 'A test description'}
        file_data = {'image': self.image}
        form = UploadPostForm(data=form_data, files=file_data)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = self.user  # Assume a Post requires a user instance
            post.save()
            self.assertEqual(Post.objects.count(), 1)
            self.assertEqual(Post.objects.first().description, 'A test description')
        else:
            self.fail('The form should be valid but is not.')
