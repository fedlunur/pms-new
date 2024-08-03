# events/urls.py
from django.urls import path
from .views import EventListCreate, EventRetrieveUpdateDestroy, NotificationListCreate, NotificationRetrieveUpdateDestroy

urlpatterns = [
    path('api/events/', EventListCreate.as_view()),
    path('api/events/<int:pk>/', EventRetrieveUpdateDestroy.as_view()),
    path('api/notifications/', NotificationListCreate.as_view()),
    path('api/notifications/<int:pk>/', NotificationRetrieveUpdateDestroy.as_view()),
]
