# User: colors
# List: id, title, owner (userId), dateCreated,
# ListItem: id, listId, completed, content
from django.db import models
from django.contrib.auth.models import User


class List(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(blank=True, null=True, default=None)
    list_items = models.ManyToManyField('ListItem', related_name='list_items')


class ListItem(models.Model):
    id = models.AutoField(primary_key=True)
    completed = models.BooleanField()
    content = models.CharField(max_length=200)

    def natural_key(self):
        return (self.id)
