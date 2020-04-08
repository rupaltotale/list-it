from rest_framework import serializers
from .models import List, ListItem
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User


class ListItemSerializer(serializers.ModelSerializer):
    list_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ListItem
        fields = ('id', 'completed', 'content', 'list_id')

    def create(self, validated_data):
        validated_data.pop("list_id")
        return(ListItem.objects.create(**validated_data))


class ListSerializer(serializers.ModelSerializer):
    date_created = serializers.DateTimeField(
        read_only=True,
    )
    list_items = ListItemSerializer(
        many=True,
        read_only=True
    )
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = List
        fields = ('id', 'title', 'owner', 'date_created', "list_items")


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')
