from django.contrib import admin
from .views import TodoListCreate, TodoRetrieveUpdateDestroy
from django.urls import path,include

urlpatterns = [
  path('api/todos/', TodoListCreate.as_view(), name='todo-list-create'),
    path('api/todos/<int:pk>/', TodoRetrieveUpdateDestroy.as_view(), name='todo-detail'),
  
]
