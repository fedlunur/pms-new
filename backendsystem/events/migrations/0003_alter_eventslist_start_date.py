# Generated by Django 4.2.11 on 2024-05-21 12:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_remove_eventslist_due_date_remove_eventslist_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventslist',
            name='start_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
