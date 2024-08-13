from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Rating
from .serializers import RatingSerializer

@api_view(['POST'])
def rate_coffee_shop(request):
    serializer = RatingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_coffee_shop_rating(request):
    name = request.query_params.get('shopName')
    try:
        coffee_shop = Rating.objects.get(name=name)
        serializer = RatingSerializer(coffee_shop)
        return Response(serializer.data)
    except Rating.DoesNotExist:
        return Response({'error': 'Coffee shop not found'}, status=status.HTTP_404_NOT_FOUND)


