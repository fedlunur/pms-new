from django.contrib import admin
from .models import *


class EventAdmin(admin.ModelAdmin):
    list_display = ['title','start','end','all_day']

admin.site.register(Event,EventAdmin)       
 

class NotificationAdmin(admin.ModelAdmin):
    list_display = ['event', 'user','message', 'icon', 'read', 'timestamp']
    

admin.site.register(Notification, NotificationAdmin)
    
    
    
        