# Generated by Django 4.1.6 on 2023-08-18 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_message_created_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='what_is_it',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
