from django.shortcuts import render
from django.http import JsonResponse
from api.models import User,Profile,TeamMember

from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer,TeamMemberSerializer,UserSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#used to create new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method =='GET':
        response={"hey{request.user}, you are alowed"}
        return Response({'response': response}, status=status.HTTP_200_OK)
    elif request.method =='POST':
        text=request.POST.get("text")
        return Response({'response': text}, status=status.HTTP_200_OK)
    return Response({}, status=status.HTTP_200_OK)

# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)

# allow user if authenticated other wise denied 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


class TeamMemberListCreate(generics.ListCreateAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

