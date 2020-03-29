# Get all lists
# Create a list, listItem
# Update a list, listItem
# Delete a list, listItem
# Create user


from .models import Lead
from .serializers import LeadSerializer
from rest_framework import generics


class LeadListCreate(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
