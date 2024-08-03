from django.contrib import admin
from .models import *


class Activity_listAdmin(admin.ModelAdmin):
    # inlines=[Task_cardInline]
    list_display = ['project_name','list_title']
    search_fields = ['project_name','list_title']
  
admin.site.register(Activity_list,Activity_listAdmin)


class  Task_cardAdmin(admin.ModelAdmin):
 
    list_display = [ 'task_name','status','activity']
    search_fields = ['task_name','status']
    list_filter = ('activity','status') # to add list filters 
    raw_id_fields = ['activity']
     
admin.site.register(Task_card,Task_cardAdmin)     

# class  Task_cardAdmin(admin.ModelAdmin):
 
#     list_display = [ 'task_name','status','activity']
#     search_fields = ['task_name','status']
#     list_filter = ('activity','status') # to add list filters 
#     raw_id_fields = ['activity']
     
# 
# class  Task_MemberAdmin(admin.ModelAdmin):
 
#     list_display = [ 'task']
# admin.site.register(Task_Member,Task_MemberAdmin) 

class Task_CheckListAdmin(admin.ModelAdmin):
    list_display = [ 'name','status']
 
admin.site.register(Task_CheckList,Task_CheckListAdmin)   

class TaskCard_AttachmentAdmin(admin.ModelAdmin):
    list_display=['name','task_card','path']
    
admin.site.register(TaskCard_Attachment,TaskCard_AttachmentAdmin)       

# class TaskAssignmentAdmin(admin.ModelAdmin):
#     model = TaskAssignment
#     list_display=['user','task_member']
# admin.site.register(TaskAssignment, TaskAssignmentAdmin)    
class TaskMemberAdmin(admin.ModelAdmin):
     model = Task_Member
     list_display=['task','assigned_to']

    
admin.site.register(Task_Member, TaskMemberAdmin)



# @admin.register(Task_Member)
# class TaskMemberAdmin(admin.ModelAdmin):
#     inlines = [TaskAssignmentInline]
#     list_display = ('task', 'created_at', 'updated_at')

class BookAdmin(admin.ModelAdmin):
    list_display = [ 'title','author']
 
admin.site.register(Book,BookAdmin)   


class AuthorAdmin(admin.ModelAdmin):
    list_display = [ 'name','email']
 
admin.site.register(Author,AuthorAdmin)   

class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', 'task', 'created_at', 'updated_at']
    search_fields = ['title', 'task__task_name']
    list_filter = ['task', 'created_at']

admin.site.register(Issue, IssueAdmin)

class IssueReplyAdmin(admin.ModelAdmin):
    list_display = ['issue', 'user', 'reply_text', 'created_at']
    search_fields = ['issue__title', 'user__username', 'reply_text']
    list_filter = ['issue', 'created_at']

admin.site.register(IssueReply, IssueReplyAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_display = ['user','text','task']
 
admin.site.register(Comment,CommentAdmin)   

class ReplyAdmin(admin.ModelAdmin):
    list_display = ['user','text',]
 
admin.site.register(Reply,ReplyAdmin)   