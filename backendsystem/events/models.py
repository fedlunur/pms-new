from django.db import models
from api.models  import Profile,User
from projects.models import Project
from django.utils.timezone  import datetime
from api.models import TeamMember

class Event(models.Model):
  title = models.CharField(max_length=255)
  start = models.DateTimeField(default=datetime.now)
  end = models.DateTimeField(blank=True, null=True)
  all_day = models.BooleanField(default=False)

  def __str__(self):
    return self.title

class Notification(models.Model):
    event = models.ForeignKey(Event, related_name='notifications', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    icon = models.CharField(max_length=50, default="fa-info-circle")
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return self.message