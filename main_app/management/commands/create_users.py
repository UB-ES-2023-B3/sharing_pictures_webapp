from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker

class Command(BaseCommand):
    help = "Create random users for testing purposes."

    def add_arguments(self, parser):
        parser.add_argument(
            'total', type=int, help='Indicates the number of users to be created'
        )

    def handle(self, *args, **kwargs):
        fake = Faker()
        total = kwargs['total']
        User = get_user_model()

        for _ in range(total):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                # Add any other necessary fields as needed
            )
            user.set_password("testpassword")  # or use fake.password()
            user.save()

            self.stdout.write(self.style.SUCCESS(f"Successfully created user {user.username}"))

