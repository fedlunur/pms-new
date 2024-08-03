from django.contrib import admin
from .models import *
# Register your models here.

class  ProjectAdmin(admin.ModelAdmin):
 
    list_display = ['project_name','team','description','start_date','end_date','created_by','created_at']
    search_fields = ['project_name']
    
     
admin.site.register(Project,ProjectAdmin)     

class ProjectAdminArea(admin.AdminSite):
    
    site_header='Project Adminstration'
    
project_site=ProjectAdminArea(name='Project')   


#the below model will appear in project admin area
project_site.register(Project)