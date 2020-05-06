from rest_framework import serializers
from .models import List, ListItem
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
import sys
from django.core import exceptions
import django.contrib.auth.password_validation as validators


class ListItemSerializer(serializers.ModelSerializer):
    list_id = serializers.IntegerField(write_only=True, required=False)
    content = serializers.CharField(trim_whitespace=False, allow_blank=True)
    class Meta:
        model = ListItem
        fields = ('id', 'completed', 'content', 'list_id')

    def create(self, validated_data):
        if "list_id" in validated_data:
            validated_data.pop("list_id")
        return(ListItem.objects.create(**validated_data))


class ListSerializer(serializers.ModelSerializer):
    title = serializers.CharField(trim_whitespace=False, allow_blank=True)
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
        fields = ('username', 'first_name', 'last_name', 'email', 'date_joined')        

class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

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

    def validate(self, data):
        # here data has all the fields which have validated values
        # so we can create a User instance out of it
        user = User(**data)

        # get the password from the data
        password = data.get('password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validators.validate_password(password=password, user=user)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(UserSerializerWithToken, self).validate(data)

    class Meta:
        model = User
        fields = ('token', 'username', 'password',
                  'email', 'first_name', 'last_name')
