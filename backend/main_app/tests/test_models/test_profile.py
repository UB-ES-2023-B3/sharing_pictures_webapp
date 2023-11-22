# backend/main_app/tests/test_models/test_profile.py
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from backend.main_app.models import Profile, CustomUser, Post
from django.utils import timezone

class ProfileModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a user for the foreign key relationship
        cls.user = CustomUser.objects.create_user(email='testuser@example.com', username='testuser', password='12345')
        # Create another user for the many-to-many relationships
        cls.other_user = CustomUser.objects.create_user(email='otheruser@example.com', username='otheruser', password='12345')
        # Create a dummy image file for the profile
        cls.profile_image = SimpleUploadedFile(name='test_profile_image.jpg', content=b'some image data', content_type='image/jpeg')
        # Create a post for the many-to-many relationship with likes
        cls.post = Post.objects.create(
            user=cls.user,
            image=SimpleUploadedFile(name='test_post_image.jpg', content=b'some image data', content_type='image/jpeg'),
            description='A test post',
            created_at=timezone.now()
        )
        # Create the Profile instance
        cls.profile = Profile.objects.create(
            user=cls.user,
            id_user=cls.user.id,
            bio='A test bio',
            profileimg=cls.profile_image
        )
        cls.profile.likes.add(cls.post)
        cls.profile.following.add(cls.other_user)

    def test_user_field(self):
        self.assertEquals(self.profile.user, self.user)

    def test_id_user_field(self):
        self.assertEquals(self.profile.id_user, self.user.id)

    def test_bio_field(self):
        self.assertEquals(self.profile.bio, 'A test bio')

    def test_profileimg_field(self):
        # Check if the file path starts with 'profile_images/'
        self.assertTrue(self.profile.profileimg.name.startswith('profile_images/'))

    def test_likes_field(self):
        # Check if the post added to likes is the one we created
        self.assertIn(self.post, self.profile.likes.all())

    def test_following_field(self):
        # Check if the other user added to following is the one we created
        self.assertIn(self.other_user, self.profile.following.all())

    def test_str_method(self):
        expected_object_name = self.user.username
        self.assertEquals(expected_object_name, str(self.profile))
