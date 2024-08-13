from .models import Rating
from rest_framework import serializers

class RatingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rating
        fields = ['name', 'rating']
