from rest_framework import serializers
from .models import *
from projects.models import *
from projects.serializers import *
from api.serializer import UserSerializer

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'