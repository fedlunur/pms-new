# from django.shortcuts import render
# from .models import Todo
# from rest_framework.response import Response 
# from rest_framework import generics,status
# from rest_framework.decorators import api_view
# from .serializers import TodoSerializer

# from django.shortcuts import get_object_or_404
# from django.http import HttpResponseNotFound
# # Create your views here.
# @api_view(['GET', 'POST'])
# def todo_list(request):
#     if request.method =="GET":
#         todos=Todo.objects.all()
#         serializer=TodoSerializer(todos,many=True)
#         return Response(serializer.data)
#     elif request.method == "POST":
#         #create new request to fetch new data
#         serializer=TodoSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,status=status.HTTP_201_CREATED)
#         return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
# @api_view(['GET', 'PUT','PATCH','DELETE'])
# def todo_detail(request,pk):
  
#     todo=get_object_or_404(Todo,id=pk)
#     if request.method=="GET":
#         serializer=TodoSerializer(todo)# updated todo serialize synch
#         return Response(serializer.data)
    
#     if request.method == "PUT":
#         #create new request to fetch new data
#         serializer=TodoSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
#     if request.method == "DELETE":
#         todo.delete()
    
#         return Response(status=status.HTTP_204_NO_CONTENT)


# views.py

from rest_framework import generics
from .models import Todo
from .serializers import TodoSerializer

class TodoListCreate(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
