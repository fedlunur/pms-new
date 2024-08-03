# Generated by Django 4.2.11 on 2024-04-28 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_profile_last_name_remove_profile_middle_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='full_name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
