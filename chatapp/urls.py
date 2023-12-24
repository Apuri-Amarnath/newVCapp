from django.urls import path
from .views import HomeView,ChatView
urlpatterns = [
    path('',HomeView.as_view(),name='home'),
    path('chat/',ChatView.as_view(),name='chat'),
]