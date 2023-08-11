from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login as login_
from django.contrib.auth.models import User

from chat.models import ChatUser, Message

def arkadaslar(current_user):

    try:
        rooms = ChatUser.objects.filter(user=current_user).values_list('room__id', flat=True)

        other_users_in_rooms = []

        for room in rooms:
            users_in_room = ChatUser.objects.filter(room=room).exclude(user=current_user).values_list('user__username', flat=True)
            other_users_in_rooms.append({"room": room, "users": users_in_room[0]})

    except ChatUser.DoesNotExist:
        other_users_in_rooms = []
    
    return other_users_in_rooms

def index(request):
    other_users_in_rooms = arkadaslar(request.user)

    return render(request, 'chat/index.html', {"other_users_in_rooms": other_users_in_rooms})

def startChat(request, room_id):
    other_users_in_rooms = arkadaslar(request.user)

    messages = Message.objects.filter(room_id = room_id)
    user2 = ChatUser.objects.filter(room=room_id).exclude(user=request.user).values_list('user__username', flat=True)

    return render(request, 'chat/room_v2.html', {"room_id" : room_id, "username" : user2[0], "other_users_in_rooms": other_users_in_rooms, "messages": messages,})

def room(request, room_name):
    other_users_in_rooms = arkadaslar(request.user)
    messages = Message.objects.filter(room_id = room_name)

    return render(request, "chat/room_v2.html",  {"other_users_in_rooms": other_users_in_rooms, "messages": messages,})

def login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(username=username, password=password)

        if user:
            login_(request, user)
            return redirect("index")

    return render(request, 'chat/login.html')