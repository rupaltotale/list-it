from django.contrib import admin

# Register your models here.
from django.conf import settings
from .models import CustomUser

# Register your models here.
admin.site.register(CustomUser)
