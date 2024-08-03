from django.contrib import admin
from api.models import *

class UserAdmin(admin.ModelAdmin):
    list_display=['username','email',]

class ProfileAdmin(admin.ModelAdmin):
    list_editable=['verified']
    list_display=['user','verified']# Register your models here.

admin.site.register(User,UserAdmin)

admin.site.register(Profile,ProfileAdmin)

class TeamAdmin(admin.ModelAdmin):
    
    list_display=['name']# Register your models here.

admin.site.register(Team,TeamAdmin)

class TeamMemberAdmin(admin.ModelAdmin):
    
    list_display=['user','team','role']# Register your models here.

admin.site.register(TeamMember,TeamMemberAdmin)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'role')
    search_fields = ('user__username', 'role__name')
    list_filter = ('role',)
    raw_id_fields = ('user',)