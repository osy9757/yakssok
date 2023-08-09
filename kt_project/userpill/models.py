from django.db import models

# Create your models here.
class user_pill(models.Model):
    user_id = models.CharField(max_length=100)
    pill_name = models.CharField(max_length=100)
    
    
 
