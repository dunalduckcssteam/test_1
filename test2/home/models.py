# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class GameInfo(models.Model):
    UserID = models.CharField(max_length=50)
    Game1 = models.DateTimeField('date published')
    Game1_Score = models.IntegerField(default = 0)
    Game2 = models.DateTimeField('date published')
    Game2_Score = models.IntegerField(default = 0)

# Create your models here.
