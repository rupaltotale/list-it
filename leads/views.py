# Get all lists
# Create a list, listItem
# Update a list, listItem
# Delete a list, listItem
# Create user


from rest_framework import generics
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.generics import ListAPIView, CreateAPIView, \
    RetrieveUpdateDestroyAPIView, GenericAPIView

from .serializers import UserSerializer, UserSerializerWithToken, \
    ListSerializer, ListItemSerializer
from .models import List, ListItem
from django.utils import timezone


class ListGet(ListAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.all().filter(owner=self.request.user)


class ListCreate(CreateAPIView):
    serializer_class = ListSerializer

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            date_created=timezone.now()
        )


class ListRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = List.objects.all()
    lookup_field = 'id'
    serializer_class = ListSerializer

    def delete(self, request, *args, **kwargs):
        list_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('list_data_{}'.format(list_id))
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            list = response.data
            cache.set('list_data_{}'.format(list['id']), {
                'title': list['title']
            })
        return response

########################### User endpoints ########################################
@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
