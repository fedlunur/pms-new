from rest_framework import generics ,viewsets,status
from .models import Activity_list,Task_card,Task_CheckList,Task_Member,User,TaskCard_Attachment
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer


from .serializers import *

class Activity_listListCreate(generics.ListCreateAPIView):
    queryset = Activity_list.objects.all()
    serializer_class = Activity_ListSerializer

class Activity_listRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity_list.objects.all()
    serializer_class = Activity_ListSerializer
    
    
class Task_cardListCreate(generics.ListCreateAPIView):
    queryset = Task_card.objects.all()
    serializer_class = TaskCardSerializer

class Task_cardRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
     queryset = Task_card.objects.all()
     serializer_class = TaskCardSerializer
     
     
# class Activity_listRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Activity_list.objects.all()
#     serializer_class = Activity_ListSerializer
     

     
class Task_CheckListRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
     queryset = Task_CheckList.objects.all()
     serializer_class = TaskCheckListSerializer     
         
class TaskCheckListCreateAPIView(generics.ListCreateAPIView):
    queryset = Task_CheckList.objects.all()
    serializer_class = TaskCheckListSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        task_id = self.request.query_params.get('task', None)
        if task_id is not None:
            queryset = queryset.filter(task=task_id)
        return queryset
    

class TaskListByActivity(generics.ListAPIView):
    serializer_class = TaskCardSerializer
   
    def get_queryset(self):
        activity_id = self.kwargs['activity_id']
        # print(f" the incoming activity is is {activity_id}")
        return Task_card.objects.filter(activity_id=activity_id)     






# task and Members manage 
     
class Task_MemberRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
     queryset = Task_Member.objects.all()
     serializer_class = TaskMemberSerializer     
     def delete(self, request, *args, **kwargs):
        assigned_to = kwargs.get('assigned_to')
        task_id = kwargs.get('task')
        print(" ##### At the back end "+str(assigned_to) + " task_id"+str(task_id))
        if not assigned_to or not task_id:
            return Response({'error': 'Both assigned_to and task parameters are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            task_member = Task_Member.objects.get(assigned_to=assigned_to, task=task_id)
            task_member.delete()
            print("after Delete ")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task_Member.DoesNotExist:
            return Response({'error': 'Task_Member not found'}, status=status.HTTP_404_NOT_FOUND) 
class TaskMemberListCreateAPIView(generics.ListCreateAPIView):
    queryset = Task_Member.objects.all()
    serializer_class = TaskMemberSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        task_id = self.request.query_params.get('task', None)
        if task_id is not None:
            queryset = queryset.filter(task=task_id)
        return queryset
 
    


class TaskCard_AttachmentListCreate(generics.ListCreateAPIView):
    queryset = TaskCard_Attachment .objects.all()
    serializer_class = TaskCardAttachmentSerializer

class TaskCard_AttachmentRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
     queryset = TaskCard_Attachment .objects.all()
     serializer_class = TaskCardAttachmentSerializer
     
from django.http import HttpResponse
from django.conf import settings
import os

def download_file(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'project_files', file_name)
    print("File download is called")
    print(file_name)
    with open(file_path, 'rb') as file:
        response = HttpResponse(file.read())
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        # Add the URL of the file to the response
        response['File-URL'] = file_path
        return response
    
    
class BookListCreateView(generics.ListCreateAPIView):
       queryset = Book.objects.all()
       serializer_class = BookSerializer

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
       queryset = Book.objects.all()
       serializer_class = BookSerializer
       
class IssueListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        queryset = Issue.objects.all()
        task_id = self.request.query_params.get('task', None)
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        return queryset

class IssueRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueReplyCreateAPIView(generics.CreateAPIView):
    queryset = IssueReply.objects.all()
    serializer_class = IssueReplySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        issue_id = request.data.get('issue')
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class IssueReplyRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = IssueReply.objects.all()
    serializer_class = IssueReplySerializer
    

class CommentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class ReplyListCreateAPIView(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

class ReplyRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer