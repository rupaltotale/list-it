from rest_framework import serializers
from .models import List, ListItem, CustomUser, Tag
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
import sys
from django.core import exceptions
import django.contrib.auth.password_validation as validators

class TagSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True
    )
    list_id = serializers.IntegerField(write_only=True, required=False)
    date_created = serializers.DateTimeField(
        read_only=True,
    )

    class Meta:
        model = Tag
        fields = ('id', 'name', 'owner', 'list_id', 'date_created')

    def create(self, validated_data):
        if "list_id" in validated_data:
            validated_data.pop("list_id")
        return(Tag.objects.create(**validated_data))

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

class ListSerializerUpdateTags(serializers.ModelSerializer):
    title = serializers.CharField(trim_whitespace=False, allow_blank=True, read_only=True)
    color = serializers.CharField(allow_blank=True, required=False, read_only=True)
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
    tags = TagSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = List
        fields = ('id', 'title', 'owner',
                  'date_created', 'list_items', 'color', 'tags')
    
    def update(self, instance, validated_data):
        # Update the  instance
        # instance.tags = validated_data['tags']
        # instance.save()
        # print(validated_data['tags'])

        # Delete any detail not included in the request
        if "tags" in validated_data:
            tag_names = [item["name"] for item in validated_data['tags']]
            # print(tag_names)
            # print(instance.id)
            _list = List.objects.get(pk=instance.id)
            for tag in _list.tags.all():
                if tag.name not in tag_names:
                    _list.tags.remove(tag)
            return _list
        # for tag in List.tags.all():
        #     if tag.id not in tag_ids:
        #         tag.delete()

        # Create or update owner 
        # for tag in validated_data['tags']:
        #     tag_obj = Tag.objects.get(pk=item['id'])
        #     if tag_obj:
        #         tag_obj.some_field=item['some_field']
        #         ....fields...
        #     else:
        #        ownerObj = Owner.create(car=instance,**owner)
        #     ownerObj.save()

        # return super().update(instance, validated_data)
    # def update(self, instance, validated_data):
    #     if "tags" in validated_data:
    #         validated_data.pop("tags")
    #     return(List.objects.update(**validated_data))


class ListSerializer(serializers.ModelSerializer):
    title = serializers.CharField(trim_whitespace=False, allow_blank=True)
    color = serializers.CharField(allow_blank=True, required=False)
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
    tags = TagSerializer(
        many=True,
        required=False,
        read_only=True
    )

    class Meta:
        model = List
        fields = ('id', 'title', 'owner',
                  'date_created', 'list_items', 'color', 'tags')


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'first_name',
                  'last_name', 'email', 'date_joined', 'theme')

class UserSerializerForCreation(serializers.ModelSerializer):

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

        return super(UserSerializerForCreation, self).validate(data)

    class Meta:
        model = CustomUser
        fields = ('id', 'token', 'username', 'password',
                  'email', 'first_name', 'last_name')
