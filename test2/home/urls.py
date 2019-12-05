from django.contrib.auth import views as auth_views
from django.conf.urls import url
from . import views
from django.views.generic import TemplateView

urlpatterns=[
    url(r'^$', views.index),
    url(r'^logout/$', auth_views.LogoutView, name='logout'),
    url(r'^login/$', auth_views.LoginView,  {'template_name':'memo_app/login.html'}, name="login"),
    url(r'^about/',views.about, name="about"),
    url(r'^game/',views.game, name="game"),
    url(r'^MineSweeper/',views.MineSweeper, name="MineSweeper"),
    url(r'^CandyCrush/',views.CandyCrush, name="CandyCrush"),
    url(r'^purchase/',views.credit, name="credit"),
    url(r'^game_selected_1',views.game_selected_1, name="game_selected_1"),
    url(r'^game_selected_2', views.game_selected_2, name="game_selected_2"), 
    url(r'^buy_game_1', views.buy_game_1, name="buy_game_1"),
    url(r'^buy_game_2', views.buy_game_2, name="buy_game_2"),
]