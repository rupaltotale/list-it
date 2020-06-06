# User: themes
# List: id, title, owner (userId), dateCreated,
# ListItem: id, listId, completed, content
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

from django.utils.translation import gettext_lazy as _


class Themes(models.TextChoices):
    LIGHT = 'L', _('Light')
    DARK = 'D', _('Dark')


class CustomUser(AbstractUser):
    # username = None
    # email = models.EmailField(_('email address'), unique=True)

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = []

    # objects = CustomUserManager()

    # spouse_name = models.CharField(blank=True, max_length=100)
    # date_of_birth = models.DateField(blank=True, null=True)
    id = models.AutoField(primary_key=True)
    theme = models.CharField(
        max_length=2,
        choices=Themes.choices,
        default=Themes.LIGHT,
    )

    def __str__(self):
        return "Email: {}, Username: {}".format(self.email, self.username)

class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length = 20, unique=True)

class List(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateTimeField(blank=True, null=True, default=None)
    list_items = models.ManyToManyField('ListItem', related_name='list_items')
    tags = models.ManyToManyField('Tag', related_name="tags")
    color = models.CharField(max_length=50, blank=True, null=True, default="Default")


class ListItem(models.Model):
    id = models.AutoField(primary_key=True)
    completed = models.BooleanField()
    content = models.CharField(max_length=200)

    def natural_key(self):
        return (self.id)
