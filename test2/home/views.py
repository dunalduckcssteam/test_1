# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from .forms import CreateUserForm
from django.urls import reverse_lazy
from django.contrib.auth.models import User, BaseUserManager
from .models import GameInfo
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
import datetime
import json
from .security import AESCipher
from django.conf import settings

# Create your views here.

def index(request):
    return render(request, 'home/home.html')

def about(request):
    return render(request, 'home/about.html')

def game(request):
    return render(request, 'home/game.html')

@login_required
def MineSweeper(request):
    return render(request, 'home/MineSweeper.html')

# 여기에  get post 분기 나누어서 처리하고 싶다.... csrf토큰 403
@login_required
def CandyCrush(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        print(json_data)
        score = json_data['score']
        
        key = getattr(settings, 'SECRET_KEY')
        cipher_class = AESCipher(key)
        encrypt_score = cipher_class.encrypt(score)

        games = GameInfo.objects.get(UserID = request.user.username)
        # games.Game1_Score = score
        games.Game1_Score = encrypt_score
        games.save()
        return JsonResponse({'result':1})   
    else:
        return render(request, 'home/CandyCrush.html')

@login_required
def credit_1(request):
    return render(request,'home/credit_1.html')

@login_required
def credit_2(request):
    return render(request,'home/credit_2.html')


class CreateUserView(CreateView): # generic view중에 CreateView를 상속받는다.
    template_name = 'registration/signup.html' # 템플릿은?
    form_class =  CreateUserForm # 푸슨 폼 사용? >> 내장 회원가입 폼을 커스터마지징 한 것을 사용하는 경우
    # form_class = UserCreationForm >> 내장 회원가입 폼 사용하는 경우
    # 성공하면 어디로?
    success_url = reverse_lazy('signup_done')


class RegisteredView(TemplateView): # generic view중에 TemplateView를 상속받는다.
    template_name = 'registration/signup_done.html' # 템플릿은?


@login_required
def game_selected_1(request):
    default_date= "01/01/1900, 00:00:00"
    # games = GameInfo.objects.get_object_or_404(GameInfo, UserID=request.user.username)
    games = GameInfo.objects.get(UserID = request.user.username)

    key = getattr(settings,'SECRET_KEY')
    cipher_class = AESCipher(key)
    decrypt_date = cipher_class.decrypt(games.Game1)
    if decrypt_date == default_date:
        return credit_1(request)
    else:
        return MineSweeper(request)

@login_required
def game_selected_2(request):
    default_date= "01/01/1900, 00:00:00"
    games = GameInfo.objects.get(UserID = request.user.username)
    key = getattr(settings,'SECRET_KEY')
    cipher_class = AESCipher(key)
    decrypt_date = cipher_class.decrypt(games.Game2)
    if decrypt_date == default_date:
        return credit_2(request)
    else:
        return CandyCrush(request)

@login_required
def buy_game_1(request):
    
    date_now = datetime.datetime.now()
    games = GameInfo.objects.get(UserID = request.user.username)
    key = getattr(settings,'SECRET_KEY')
    cipher_class = AESCipher(key)
    encrypt_date = cipher_class.encrypt(date_now.strftime("%m/%d/%Y, %H:%M:%S"))
    games.Game1 = encrypt_date
    games.save()
    return render(request,'home/credit_done.html')

@login_required
def buy_game_2(request):
    date_now = datetime.datetime.now()
    games = GameInfo.objects.get(UserID = request.user.username)
    key = getattr(settings,'SECRET_KEY')
    cipher_class = AESCipher(key)
    encrypt_date = cipher_class.encrypt(date_now.strftime("%m/%d/%Y, %H:%M:%S"))
    games.Game2 = encrypt_date
    print(encrypt_date)
    games.save()
    return render(request,'home/credit_done.html')
