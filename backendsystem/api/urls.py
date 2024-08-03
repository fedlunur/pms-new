from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from api import views
from api import serializer


urlpatterns = [
    path("token/",views.MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path("register/",views.RegisterView.as_view()),
    path("dashboard/",views.dashboard),
    path("test/",views.testEndPoint,name='test'),
    path("users/",views.UserList.as_view(),name='users'),
   
    path("",views.getRoutes),

]