# -*- coding: utf-8 -*- 

from django import forms 
from django.contrib.auth.models import User #1
from django.contrib.auth.forms import UserCreationForm
from .models import GameInfo
import datetime

class CreateUserForm(UserCreationForm): # 내장 회원가입 폼을 상속받아서 확장한다.
    email = forms.EmailField(required=True) # 이메일 필드 추가
    
    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True): # 저장하는 부분 오버라이딩
        user = super(CreateUserForm, self).save(commit=False) # 본인의 부모를 호출해서 저장하겠다.
        user.email = self.cleaned_data["email"]
        default_date= datetime.datetime(1900,1,1,0,0,0)
        games=GameInfo(UserID=user.username,Game1=default_date, Game2=default_date,Game1_Score=0, Game2_Score=0)
        if commit:
            user.save()
            games.save()
        return user