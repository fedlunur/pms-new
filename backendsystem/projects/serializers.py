from rest_framework import serializers
from .models import *

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model =Project
        # fields = ['project_name','description','start_date','end_date']
        fields = ['id', 'project_name', 'description', 'start_date', 'end_date', 'created_at', 'created_by', 'team']
