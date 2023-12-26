from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class MeetingModel:
    meetingId = None
    owner = None
    meetingTitle = None
    offerData = None
    answers = None

    def __init__(self, meetingId=None, owner=None, meetingTitle=None, offerData=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.meetingId = meetingId
        self.owner = owner
        self.offerData = offerData
        self.meetingTitle = meetingTitle
        self.answers = dict()
