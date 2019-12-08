# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class GameInfo(models.Model):
    UserID = models.CharField(max_length=50)
    Game1 = models.CharField(max_length=256)
    Game1_Score = models.IntegerField(default = 0)
    Game2 = models.CharField(max_length=256)
    Game2_Score = models.IntegerField(default = 0)

    def __str__(self):
        return '%s' % (self.UserID)

# Create your models here.
