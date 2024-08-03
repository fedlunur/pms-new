from rest_framework import generics ,viewsets,status
from .serializers import *
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Event, Notification
from .serializers import EventSerializer, NotificationSerializer

class EventListCreate(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        event = serializer.save()
        current_user = self.request.user
        message = f"Event '{event.title}' has been created."
        Notification.objects.create(event=event, user=current_user, message=message, icon="fa-plus")

class EventRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        event = serializer.save()
        current_user = self.request.user
        message = f"Event '{event.title}' has been updated."
        Notification.objects.create(event=event, user=current_user, message=message, icon="fa-edit")

    def perform_destroy(self, instance):
        message = f"Event '{instance.title}' has been deleted."
        current_user = self.request.user
        Notification.objects.create(event=instance, user=current_user, message=message, icon="fa-trash")
        instance.delete()

class NotificationListCreate(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class NotificationRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    
# from .serializers import EventSerializer
# class EventListCreate(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# class EventRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# class EventListCreate(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

#     def perform_create(self, serializer):
#         event = serializer.save()
#         Notification.objects.create(message=f"Event '{event.title}' added.")
# # 
# class EventRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

#     def perform_destroy(self, instance):
#         Notification.objects.create(message=f"Event '{instance.title}' deleted.")
#         super().perform_destroy(instance)

 