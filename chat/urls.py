from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
    path("start-chat/<str:room_id>/", views.startChat, name="startChat"),
]