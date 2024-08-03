from django.contrib import admin
from tasks.views import *
from events.views import *
from django.urls import path,include
urlpatterns = [
  path('api/activitylist/', Activity_listListCreate.as_view(), name='activity-list-create'),
  path('api/activitylist/<int:pk>/', Activity_listRetrieveUpdateDestroy.as_view(), name='activitylist-detail'),
  path('api/taskslist/byactivity/<int:activity_id>/', TaskListByActivity.as_view(), name='task-list-by-activity'),
  path('api/tasklist/', Task_cardListCreate.as_view(), name='task-list-create'),
  path('api/tasklist/<int:pk>/',Task_cardRetrieveUpdateDestroy.as_view(), name='tasklist-detail'),
  path('api/taskslist/byactivity/<int:activity_id>/', TaskListByActivity.as_view(), name='task-list-by-activity'),  
  # path('api/taskmembers/', TaskMemberListCreateAPIView.as_view(), name='taskmember-list-create'),
  path('api/taskchecklist/', TaskCheckListCreateAPIView.as_view(), name='taskchecklist-create'),
  path('api/taskchecklist/<int:pk>/', Task_CheckListRetrieveUpdateDestroy.as_view(), name='taskchecklist-detail'),
  path('api/taskmembers/', TaskMemberListCreateAPIView.as_view(), name='taskmember-create'),
  #path('api/taskmembers/<int:pk>/', Task_MemberRetrieveUpdateDestroy.as_view(), name='taskmember-detail'),
  path('api/taskmembers/<int:assigned_to>/<int:task>/', Task_MemberRetrieveUpdateDestroy.as_view(), name='taskmember-detail'),
  #just for the events url 
  path('api/events/', EventListCreate.as_view(), name='event-list'),
  path('api/events/<int:pk>/', EventRetrieveUpdateDestroy.as_view(), name='event-detail'),
  path('api/download/<str:file_name>/', download_file, name='download_file'),
  path('api/task-attachments/', TaskCard_AttachmentListCreate.as_view(), name=' task-attachments-list-create'),
  path('api/task-attachments/<int:pk>/',TaskCard_AttachmentRetrieveUpdateDestroy.as_view(), name='task-attachments-detail'),
  path('books/', BookListCreateView.as_view(), name='book-list'),
  path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
  path('issues/', IssueListCreateAPIView.as_view(), name='issue-list-create'),
  path('issues/<int:pk>/', IssueRetrieveUpdateDestroyAPIView.as_view(), name='issue-detail'),
  path('issue-replies/', IssueReplyCreateAPIView.as_view(), name='issue-reply-create'),
  path('issue-replies/<int:pk>/', IssueReplyRetrieveUpdateDestroyAPIView.as_view(), name='issue-reply-detail'),

]



