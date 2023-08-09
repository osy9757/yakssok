# Generated by Django 4.2.1 on 2023-06-15 02:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userinformation", "0010_accountinfo_last_login_accountinfo_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="accountinfo",
            name="is_staff",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="accountinfo",
            name="has_surgery",
            field=models.BooleanField(default=True),
        ),
    ]
