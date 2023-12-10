import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.utils import timezone
from backend.main_app.models import Post, Reports
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
User = get_user_model()


class ReportPictureViewTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='Testpassword123!')
        # Create a dummy image file
        self.image = SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg')
        # Create a Post instance
        self.post = Post.objects.create(
            image=self.image,
            user=self.user,
            description='A test description',
            created_at=timezone.now()
        )
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com', password='Testpassword123!')
        self.client.login(username='testuser2@example.com', password='Testpassword123!')

        self.report_url = reverse('report_post')
    def test_report_picture_view_post_request(self):
        # Prepare post data
        post_data = {
            
            'post_id': str(self.post.id),
            'description': 'This is a test report'
        }

        # Send POST request to the view
        response = self.client.post(self.report_url, json.dumps(post_data), content_type='application/json')

        # Check the response status and content
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), {'message': 'Report uploaded successfully'})
        post_obj = Post.objects.get(id=self.post.id)
        usr_obj = User.objects.get(id=self.user2.id)
        # Check if the report is created in the database
        report = Reports.objects.get(user=usr_obj, post=post_obj)
        self.assertIsNotNone(report)

    def test_report_picture_view_duplicate_report(self):
        # Create a report for the same post
        Reports.objects.create(user=self.user2, post=self.post, description='Duplicate report')

        # Prepare post data
        post_data = {
            'post_id': str(self.post.id),
            'description': 'This is a test report'
        }
        
        # Send POST request to the view
        response = self.client.post(self.report_url, json.dumps(post_data), content_type='application/json')

        # Check the response status and content
        self.assertEqual(response.status_code, 409)
        self.assertEqual(json.loads(response.content), {'error': 'You have already reported this post'})

        # Check that no additional report is created in the database
        reports_count = Reports.objects.filter(user=self.user2, post=self.post).count()
        self.assertEqual(reports_count, 1)
