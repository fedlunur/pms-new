from django.contrib import admin
from .views import ProjectListCreate, ProjectRetrieveUpdateDestroy
from django.urls import path,include
from api.views import *


urlpatterns = [
  path('api/project/', ProjectListCreate.as_view(), name='project-list-create'),
  path('api/project/<int:pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='project-detail'),
   path("api/teammembers/",TeamMemberListCreate.as_view()),
  
]
