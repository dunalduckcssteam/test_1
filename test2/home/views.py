# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from .forms import CreateUserForm


# Create your views here.

def index(request):
    return render(request, 'home/index.html')

def forus(request):
    return render(request, 'home/forus.html')

def logout(request):
    return render(request, 'home/logout.html')

def game(request):
    return render(request, 'home/game.html')

class CreateUserView(CreateView): # generic view중에 CreateView를 상속받는다.
    template_name = 'registration/signup.html' # 템플릿은?
    form_class =  CreateUserForm # 푸슨 폼 사용? >> 내장 회원가입 폼을 커스터마지징 한 것을 사용하는 경우
    # form_class = UserCreationForm >> 내장 회원가입 폼 사용하는 경우
    # 성공하면 어디로?

class RegisteredView(TemplateView): # generic view중에 TemplateView를 상속받는다.
    template_name = 'registration/login.html' # 템플릿은?

def logout(request):
    return redirect('home/logout.html')
