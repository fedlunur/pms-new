# Generated by Django 4.2.11 on 2024-04-29 12:40

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0009_remove_task_member_assigned_to_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='task_member',
            unique_together={('assigned_to', 'task')},
        ),
        migrations.DeleteModel(
            name='TaskAssignment',
        ),
    ]
