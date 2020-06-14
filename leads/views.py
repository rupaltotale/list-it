# Get all lists
# Create a list, listItem
# Update a list, listItem
# Delete a list, listItem
# Create user

from rest_framework import generics
from django.http import HttpResponseRedirect
# from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.generics import ListAPIView, CreateAPIView, \
    RetrieveUpdateDestroyAPIView, GenericAPIView, RetrieveAPIView, \
    RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.exceptions import ValidationError

from .serializers import UserSerializer, UserSerializerForCreation, \
    ListSerializer, ListItemSerializer, TagSerializer, ListSerializerUpdateTags
from .models import List, ListItem, CustomUser, Tag
from django.utils import timezone

########################### List endpoints ########################################


class ListGet(ListAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.all().filter(owner=self.request.user).order_by("-date_created")


class ListCreate(CreateAPIView):
    serializer_class = ListSerializer

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            date_created=timezone.now()
        )

class ListUpdateTags(RetrieveUpdateAPIView):
    queryset = List.objects.all()
    lookup_field = 'id'
    serializer_class = ListSerializerUpdateTags

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            _list = response.data
            cache.set('list_data_{}'.format(_list['id']), {
                'tags': _list['tags'],
            })
        return response

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
            _list = response.data
            cache.set('list_data_{}'.format(_list['id']), {
                'title': _list['title'],
                'color': _list['color'],
            })
        return response

########################### ListItem endpoints ########################################


class ListItemCreate(CreateAPIView):
    serializer_class = ListItemSerializer

    # def perform_create(self, serializer):
    #     serializer.save(
    #         owner=self.request.user,
    #         date_created=timezone.now()
    #     )
    def create(self, request, *args, **kwargs):
        list_id = request.data.get('list_id')
        try:
            int(list_id)
        except:
            raise ValidationError({'list_id': 'A valid list_id is required'})
        list_item = super().create(request, *args, **kwargs)
        parent_list = List.objects.all().filter(id=list_id).first()
        if parent_list is None:
            raise ValidationError(
                {'list_id': 'list with id {} does not exist'.format(list_id)})
        parent_list.list_items.add(
            ListItem.objects.all().filter(id=list_item.data["id"]).first())
        return list_item


class ListItemRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = ListItem.objects.all()
    lookup_field = 'id'
    serializer_class = ListItemSerializer

    def delete(self, request, *args, **kwargs):
        list_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('list_item_data_{}'.format(list_id))
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            _list = response.data
            cache.set('list_item_data_{}'.format(_list['id']), {
                'content': _list['content'],
                'completed': _list['completed'],
            })
        return response


########################### Tag endpoints ########################################

class TagList(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.all().filter(owner=self.request.user).order_by("-date_created")

class TagCreate(CreateAPIView):
    serializer_class = TagSerializer

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            date_created=timezone.now(),
        )
    
    def create(self, request, *args, **kwargs):
        list_id = request.data.get('list_id')
        serializer = self.get_serializer(data=request.data)
        try:
            int(list_id)
        except:
            raise ValidationError({'list_id': 'A valid list_id is required'})
        response = super().create(request, *args, **kwargs)
        parent_list = List.objects.all().filter(id=list_id).first()
        if parent_list is None:
            raise ValidationError(
                {'list_id': 'list with id {} does not exist'.format(list_id)})
        parent_list.tags.add(
            Tag.objects.all().filter(id=response.data["id"]).first()
        )
        return response

class TagRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    lookup_field = 'id'
    serializer_class = TagSerializer

    def delete(self, request, *args, **kwargs):
        response = super().delete(request, *args, **kwargs)
        return response
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        list_id = request.data.get('list_id')
        if int(list_id):
            parent_list = List.objects.all().filter(id=list_id).first()
            if parent_list is not None:
                parent_list.tags.add(
                    Tag.objects.all().filter(id=response.data["id"]).first()
                )
        return response


########################### User endpoints ########################################
class UserGet(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    lookup_field = 'id'
    serializer_class = UserSerializer
    def delete(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('user_{}'.format(user_id))
        return response
    def update(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            user = response.data
            cache.set('user_data_{}'.format(user_id), {
                'username': user['username'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
            })
        return response

class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerForCreation(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

