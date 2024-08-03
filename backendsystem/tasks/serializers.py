from rest_framework import serializers
from .models import *
from projects.models import *
from projects.serializers import *
from api.serializer import UserSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class Activity_ListSerializer(serializers.ModelSerializer):
    project_name = ProjectSerializer
    class Meta:
        model =Activity_list
        # fields = ['project_name','description','start_date','end_date']
        fields = '__all__'
 
class TaskCardSerializer(serializers.ModelSerializer):
    activity=Activity_ListSerializer
    class Meta:
        model = Task_card
   
        fields = '__all__'


from .models import Task_CheckList

class TaskCheckListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task_CheckList
        fields = '__all__'      
        
        
        
class TaskMemberSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(source='assigned_to', queryset=User.objects.all())
    task_id = serializers.PrimaryKeyRelatedField(source='task', queryset=Task_card.objects.all())
    assigned_to_first_name = serializers.CharField(source='assigned_to.first_name', read_only=True)
    class Meta:
        model = Task_Member
        fields = ['id', 'assigned_to_id', 'assigned_to_first_name','task_id', 'created_at', 'updated_at']
        
class TaskCardAttachmentSerializer(serializers.ModelSerializer):
  
  task_card = serializers.PrimaryKeyRelatedField(queryset=Task_card.objects.all())
  class Meta:
    model = TaskCard_Attachment
    fields = ['id', 'name', 'path', 'created_at', 'updated_at', 'task_card']
    
class AuthorSerializer(serializers.ModelSerializer):
       class Meta:
           model = Author
           fields = ['id', 'name', 'email']

class BookSerializer(serializers.ModelSerializer):
       author = AuthorSerializer()

       class Meta:
           model = Book
           fields = '__all__'
           
           
class IssueReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = IssueReply
        fields = ['id', 'issue', 'user', 'reply_text', 'created_at']
        read_only_fields = ['id', 'issue', 'user', 'created_at']  # Ensure these fields are read-only


class IssueSerializer(serializers.ModelSerializer):
    replies = IssueReplySerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'task', 'created_at', 'updated_at', 'replies']
        
class IssueReplyRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = IssueReply.objects.all()
    serializer_class = IssueReplySerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReplySerializer(serializers.ModelSerializer):
      
      user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Use PK field for input
      user_data = serializers.SerializerMethodField() 
      comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all()) 
      class Meta:
        model = Reply
        fields = ['id', 'user', 'comment','user_data' ,'text', 'created_at', 'updated_at']
        
      def get_user_data(self, obj):
        # Returns serialized user data
        return UserSerializer(obj.user).data
     
    
    
class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Use PK field for input
    user_data = serializers.SerializerMethodField()  # Custom method for nested user data
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_data', 'text', 'task', 'created_at', 'updated_at', 'replies']
    
    def get_user_data(self, obj):
        # Returns serialized user data
        return UserSerializer(obj.user).data

    def create(self, validated_data):
        # Create the Comment object with user from validated_data
        user = validated_data.pop('user')
        return Comment.objects.create(user=user, **validated_data)
    
    def update(self, instance, validated_data):
        # Update the user if the ID is provided
        if 'user' in validated_data:
            instance.user = validated_data.pop('user')
        # Update the rest of the Comment fields
        return super().update(instance, validated_data)