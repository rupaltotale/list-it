from django.urls import path
from . import views

urlpatterns = [
    path('current_user/', views.UserGet.as_view()),
    path('api/v1/user/<int:id>/', views.UserRetrieveUpdateDestroy.as_view()),
    path('users/', views.UserList.as_view()),
    path('api/v1/lists/', views.ListGet.as_view()),
    path('api/v1/lists/new/', views.ListCreate.as_view()),
    path('api/v1/lists/<int:id>/',
         views.ListRetrieveUpdateDestroy.as_view()
         ),
    path('api/v1/lists/<int:id>/tags/',
         views.ListUpdateTags.as_view()
         ),  
    path('api/v1/list_item/new/', views.ListItemCreate.as_view()),
    path('api/v1/list_item/<int:id>/',
         views.ListItemRetrieveUpdateDestroy.as_view()
         ),
    path('api/v1/tags/', views.TagList.as_view()),
    path('api/v1/tags/new/', views.TagCreate.as_view()),
    path('api/v1/tags/<int:id>/',
         views.TagRetrieveUpdateDestroy.as_view()
         ),
]
