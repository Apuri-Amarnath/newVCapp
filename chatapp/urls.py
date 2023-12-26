from django.urls import path
from .views import *

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('cm/', CreateMeeting.as_view(), name='createMeeting'),
    path('jm/', JoinMeeting.as_view(), name='joinMeeting'),
]
