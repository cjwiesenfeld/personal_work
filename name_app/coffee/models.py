from django.db import models

# Create your models here.



# Create your models here.
class Rating(models.Model):
    name = models.CharField(max_length=255, unique=True,default="Coffee Shop")
    rating = models.DecimalField(max_digits=3, decimal_places=2,default=5)
    def __str__(self):
        return self.name
