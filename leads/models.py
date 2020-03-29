# User
# List: id, title, owner (userId), dateCreated,
# ListItem: id, listId, completed, content
from django.db import models
from django.contrib.auth.models import User

class Lead(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

class List(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    dateCreated = models.DateTimeField()
    listItems = models.ManyToManyField('ListItem', related_name='listItems')

class ListItem(models.Model):
    completed = models.BooleanField()
    content = models.CharField(max_length=200)
