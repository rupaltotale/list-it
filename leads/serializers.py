from rest_framework import serializers
from .models import Lead, List, ListItem

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ('id', 'name', 'email', 'message')

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('title', 'owner', 'dateCreated', 'listItems')

class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ('completed', 'content')