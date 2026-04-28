from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.get_products),
    path('signup/', views.signup_user),
    path('login/', views.login_user),
    path('order/', views.place_order),
    path('orders/<str:email>/', views.get_orders),
    path('wishlist/', views.add_wishlist),
    path('wishlist/<str:email>/', views.get_wishlist),
    path('wishlist/<str:email>/<int:product_id>/', views.remove_wishlist),
    path('dashboard/<str:email>/', views.get_dashboard),
]
