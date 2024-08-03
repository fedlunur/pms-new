"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from tasks.views import *
from events.views import *
from projects.views import *
from api.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/",include("api.urls")),
    
    
     path('api/project/', ProjectListCreate.as_view(), name='project-list-create'),
   path('api/project/<int:pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='project-detail'),
   path("api/teammembers/",TeamMemberListCreate.as_view()),
  
   # this tasks URL 

  path('api/activitylist/', Activity_listListCreate.as_view(), name='activity-list-create'),
  path('api/activitylist/<int:pk>/', Activity_listRetrieveUpdateDestroy.as_view(), name='activitylist-detail'),
  path('api/taskslist/byactivity/<int:activity_id>/', TaskListByActivity.as_view(), name='task-list-by-activity'),
  path('api/tasklist/', Task_cardListCreate.as_view(), name='task-list-create'),
  path('api/tasklist/<int:pk>/',Task_cardRetrieveUpdateDestroy.as_view(), name='tasklist-detail'),
  path('api/taskslist/byactivity/<int:activity_id>/', TaskListByActivity.as_view(), name='task-list-by-activity'),  
  

  
  path('api/taskchecklist/', TaskCheckListCreateAPIView.as_view(), name='taskchecklist-create'),
  path('api/taskchecklist/<int:pk>/', Task_CheckListRetrieveUpdateDestroy.as_view(), name='taskchecklist-detail'),
  path('api/taskmembers/', TaskMemberListCreateAPIView.as_view(), name='taskmember-create'),
  
  #path('api/taskmembers/<int:pk>/', Task_MemberRetrieveUpdateDestroy.as_view(), name='taskmember-detail'),
  path('api/taskmembers/<int:assigned_to>/<int:task>/', Task_MemberRetrieveUpdateDestroy.as_view(), name='taskmember-detail'),
  
  #just for the events url 
  path('api/download/<str:file_name>/', download_file, name='download_file'),
  path('api/task-attachments/', TaskCard_AttachmentListCreate.as_view(), name=' task-attachments-list-create'),
  path('api/task-attachments/<int:pk>/',TaskCard_AttachmentRetrieveUpdateDestroy.as_view(), name='task-attachments-detail'),

  path('api/issues/', IssueListCreateAPIView.as_view(), name='issue-list-create'),
  path('api/issues/<int:pk>/', IssueRetrieveUpdateDestroyAPIView.as_view(), name='issue-detail'),
  path('api/issue-replies/', IssueReplyCreateAPIView.as_view(), name='issue-reply-create'),
  path('api/issue-replies/<int:pk>/', IssueReplyRetrieveUpdateDestroyAPIView.as_view(), name='issue-reply-detail'),

 # path('proevent/', include('events.urls')), 
    
path('api/events/', EventListCreate.as_view(),name='event-list'),
path('api/events/<int:pk>/', EventRetrieveUpdateDestroy.as_view(), name='event-detail'),
path('api/notifications/', NotificationListCreate.as_view()),
path('api/notifications/<int:pk>/', NotificationRetrieveUpdateDestroy.as_view()),    
path('api/comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
path('api/comments/<int:pk>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-detail'),   
  path('api/replies/', ReplyListCreateAPIView.as_view(), name='reply-list-create'),
    path('api/replies/<int:pk>/', ReplyRetrieveUpdateDestroyAPIView.as_view(), name='reply-detail'), 
    
    
    
    path("protodolist/",include("todolist.urls")),
    path("proproject/",include("projects.urls")),
    path("protask/",include("tasks.urls")),
    path("proevent/", include('events.urls')),
    
    
]

admin.site.index_title="CDHI-PMS"
admin.site.site_header="CDHI-Project Management System"
admin.site.site_title="CDHI-PMS"