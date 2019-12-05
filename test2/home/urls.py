from django.contrib.auth import views as auth_views
from django.conf.urls import url
from . import views
from django.views.generic import TemplateView

urlpatterns=[
    url(r'^$', views.index),
    url(r'^logout/$', auth_views.LogoutView, name='logout'),
    url(r'^login/$', auth_views.LoginView,  {'template_name':'memo_app/login.html'}, name="login"),
    url(r'^forus/',views.forus, name="forus"),
    url(r'^game/',views.game, name="game"),
    url(r'^game_selected',views.game_selected, name="game_selected")    
]