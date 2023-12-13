import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from backend.main_app.models import UserReports
from django.urls import reverse

User = get_user_model()

class ReportUserViewTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.report_user_url = reverse('report_user')
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='Testpassword123!')
        self.reported_user = User.objects.create_user(username='reporteduser', email='reporteduser@example.com', password='Testpassword123!')

    def test_report_user_view_post_success(self):
        data = {
            'reported_user': 'reporteduser',
            'description': 'This is a test report.'
        }
        self.client.force_login(self.user)
        response = self.client.post(self.report_user_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserReports.objects.count(), 1)

  


    def test_report_user_view_post_duplicate_report(self):
        data = {
            'reported_user': 'reporteduser',
            'description': 'This is a test report.'
        }
        self.client.force_login(self.user)
        # First report
        self.client.post(self.report_user_url, json.dumps(data), content_type='application/json')
        # Second report with the same data
        response = self.client.post(self.report_user_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 409)
        self.assertEqual(UserReports.objects.count(), 1)

    def test_report_user_view_get_request(self):
        response = self.client.get(self.report_user_url)
        self.assertEqual(response.status_code, 400)

# Add more tests as needed for other scenarios
