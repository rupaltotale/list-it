from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('login/', views.index ),
    path('signup/', views.index ),
    path('about/', views.index ),
    path('terms/', views.index)
]
