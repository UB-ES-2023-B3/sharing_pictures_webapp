# Generated by Django 4.2.6 on 2023-10-30 22:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_profile_posts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='posts',
            new_name='likes',
        ),
    ]
