# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from .forms import CreateUserForm
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from .models import GameInfo
from django.contrib.auth.decorators import login_required
import datetime

# Create your views here.

def index(request):
    return render(request, 'home/index.html')

def forus(request):
    return render(request, 'home/forus.html')

@login_required
def game(request):
    return render(request, 'home/game.html')

class CreateUserView(CreateView): # generic view중에 CreateView를 상속받는다.
    template_name = 'registration/signup.html' # 템플릿은?
    form_class =  CreateUserForm # 푸슨 폼 사용? >> 내장 회원가입 폼을 커스터마지징 한 것을 사용하는 경우
    # form_class = UserCreationForm >> 내장 회원가입 폼 사용하는 경우
    # 성공하면 어디로?
    success_url = reverse_lazy('signup_done')


class RegisteredView(TemplateView): # generic view중에 TemplateView를 상속받는다.
    template_name = 'registration/signup_done.html' # 템플릿은?

@login_required
def game_selected(request):
    default_date= datetime.datetime(1900,1,1,0,0,0)

    games = GameInfo.objects.get(UserID = request.user.username)
    if games.Game1 == default_date:
        return render(request,'home/credit.html')
    
    else:
        return render(request, 'home/test.html')