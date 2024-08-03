from django.db import models
from django.db.models.signals import post_save # helps 
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save


class User(AbstractUser):
   
    first_name = models.CharField(max_length=1000,null=True)
    middle_name=models.CharField(max_length=1000,null=True)
    last_name=models.CharField(max_length=1000,null=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email' # make the default email as user name 
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.username
    # def profile(self):
    #     profile = Profile.objects.get(user=self)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)


    def __str__(self) -> str:
         return self.user.username if self.user.username else 'Unnamed Profile'

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
  

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

@receiver(post_save, sender=User)
def send_registration_email(sender, instance, created, **kwargs):
    if created:
        subject = 'Welcome to CDHI Project Mangament System '
        message = 'Dear {},\n\nThank you for registering an account with us!\n\nBest regards'.format(instance.username)
        recipient_list = [instance.email]
        send_mail(subject, message, None, recipient_list)
        
  
class Team(models.Model):
    name = models.CharField(max_length=100)

    
    def __str__(self) -> str:
        
        return self.name
class TeamMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    role=models.CharField(max_length=200,null=True,blank=True,)

    def __str__(self) -> str:
        return f'{self.user.first_name} - {self.team.name}'
    # You might have additional fields related to the membership, like role, join date, etc.
    # For example:
    # role = models.CharField(max_length=50)
    # join_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'team')  
        
        
class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
   
    class Meta:
        unique_together = ('user', 'role')   
    
    def __str__(self):
        return f'{self.user.email} - {self.role.name}'
        