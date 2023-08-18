from django.db import models
from django.contrib.auth.models import User
import uuid

class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)

class ChatUser(models.Model):
    user = models.ForeignKey(User, related_name="chat_user", verbose_name="Kullanici", on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name="chat_room", verbose_name="Oda", on_delete=models.CASCADE)

class Message(models.Model):
    user = models.ForeignKey(User, related_name="messages_user", verbose_name="Kullanici", on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name="messages_room", verbose_name="Oda", on_delete=models.CASCADE)
    content = models.TextField(verbose_name="Mesaj_Icerigi")
    created_date = models.DateTimeField(auto_now_add=True)
    what_is_it = models.CharField(max_length=50, null=True)

    def get_short_date(self):
        saat = str(self.created_date.hour)
        dakika = str(self.created_date.minute)

        time = ""

        if len(saat) != 2:
            time += "0"
        
        time += (saat + ":")

        if len(dakika) != 2:
            time += "0"
        
        time += dakika

        return time

