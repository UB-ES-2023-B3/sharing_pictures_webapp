from django.test import TestCase
from django.utils import timezone
from backend.main_app.models import UserReports, CustomUser

class UserReportsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Create users for the foreign key relationships
        cls.user = CustomUser.objects.create_user(email='testuser@example.com', username='testuser', password='12345')
        cls.reported_user = CustomUser.objects.create_user(email='reporteduser@example.com', username='reporteduser', password='12345')

        cls.report = UserReports.objects.create(
            user=cls.user,
            reported_user=cls.reported_user,
            description='This is a test report.',
            created_at=timezone.now()
        )

    def test_user_reports_model_str_method(self):
        expected_str = f'{self.user.username} - {self.reported_user.username}'
        self.assertEqual(str(self.report), expected_str)

    def test_user_reports_model_fields(self):
        self.assertEqual(self.report.user, self.user)
        self.assertEqual(self.report.reported_user, self.reported_user)
        self.assertEqual(self.report.description, 'This is a test report.')
        self.assertIsNotNone(self.report.created_at)

    # Add more tests as needed for validation, unique constraints, etc.
