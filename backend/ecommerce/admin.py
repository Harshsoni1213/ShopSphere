from django.contrib import admin
from .models import Product, User, Order, OrderItem, WishlistItem

admin.site.register(Product)
admin.site.register(User)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(WishlistItem)
