import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from ecommerce.models import Product

products = [
    {"name": "iPhone 13", "price": 50000, "image": "products/iphone 15.webp"},
    {"name": "Nike Shoes", "price": 3000, "image": "products/nike shoes.webp"},
    {"name": "Smart Watch", "price": 2000, "image": "products/shopping.webp"},
    {"name": "Laptop", "price": 70000, "image": "products/laptop.webp"},
    {"name": "Headphones", "price": 1500, "image": "products/headphones.webp"},
    {"name": "Backpack", "price": 1200, "image": "products/bag.webp"},
    {"name": "Camera", "price": 45000, "image": "products/camera.webp"},
    {"name": "T-shirt", "price": 800, "image": "products/t shirt.webp"},
    {"name": "Gaming Mouse", "price": 900, "image": "products/mouse.jpg"},
    {"name": "Keyboard", "price": 1200, "image": "products/keyboard.jpg"},
    {"name": "Tablet", "price": 25000, "image": "products/tablet.jpg"},
    {"name": "Bluetooth Speaker", "price": 1800, "image": "products/speaker.jpg"},
    {"name": "Power Bank", "price": 1000, "image": "products/powerbank.jpg"},
    {"name": "Sunglasses", "price": 700, "image": "products/sunglass.jpg"},
    {"name": "Watch", "price": 1500, "image": "products/watches.jpg"},
    {"name": "Shoes", "price": 2200, "image": "products/shoes.jpg"},
    {"name": "Jacket", "price": 2500, "image": "products/jacket.jpg"},
    {"name": "Cap", "price": 400, "image": "products/cap.jpg"},
    {"name": "Bottle", "price": 300, "image": "products/bottle.jpg"},
    {"name": "Office Chair", "price": 6000, "image": "products/chair.jpg"},
]

# Pehle purane products delete karo
Product.objects.all().delete()
print("Old products deleted")

added = 0
for p in products:
    Product.objects.create(name=p["name"], price=p["price"], image=p["image"])
    added += 1
    print(f"Added: {p['name']}")

print(f"Done! {added} products added to database.")
