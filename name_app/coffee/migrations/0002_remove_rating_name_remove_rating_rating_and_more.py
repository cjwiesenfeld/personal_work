# Generated by Django 5.1 on 2024-08-13 03:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coffee', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rating',
            name='Name',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='Rating',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='created',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='longitude',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='taker',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='updated',
        ),
        migrations.AddField(
            model_name='rating',
            name='name',
            field=models.CharField(default='Coffee Shop', max_length=255, unique=True),
        ),
        migrations.AddField(
            model_name='rating',
            name='rating',
            field=models.DecimalField(decimal_places=2, default=5, max_digits=3),
        ),
    ]
