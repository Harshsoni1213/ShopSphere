from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Product, User, Order, OrderItem, WishlistItem


def home(request):
    return HttpResponse("Backend is running 🚀")


def get_products(request):
    products = Product.objects.all()
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image": request.build_absolute_uri(p.image.url) if p.image else ""
        })
    return JsonResponse(result, safe=False)


@csrf_exempt
def signup_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if User.objects.filter(email=email).exists():
            return JsonResponse({"status": "error", "message": "User already exists"})

        User.objects.create(name=name, email=email, password=password)
        return JsonResponse({"status": "success", "message": "Signup successful"})

    return JsonResponse({"status": "error", "message": "Invalid request"})


@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email, password=password)
            return JsonResponse({"status": "success", "message": "Login successful", "name": user.name, "email": user.email})
        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Invalid credentials"})

    return JsonResponse({"status": "error", "message": "Invalid request"})


@csrf_exempt
def place_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_email = data.get("user_email")
        items = data.get("items", [])

        if not user_email or not items:
            return JsonResponse({"status": "error", "message": "Missing data"})

        order = Order.objects.create(
            user_email=user_email,
            name=data.get("name"),
            phone=data.get("phone"),
            address=data.get("address"),
            payment=data.get("payment"),
            total=data.get("total")
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                product_name=item["name"],
                price=item["price"],
                quantity=item["quantity"]
            )

        return JsonResponse({"status": "success", "message": "Order placed!", "order_id": order.id})

    return JsonResponse({"status": "error", "message": "Invalid request"})


def get_orders(request, email):
    orders = Order.objects.filter(user_email=email).order_by('-created_at')
    result = []
    for order in orders:
        items = list(order.items.values('product_name', 'price', 'quantity'))
        result.append({
            "id": order.id,
            "total": order.total,
            "payment": order.payment,
            "address": order.address,
            "created_at": order.created_at.strftime("%d %b %Y"),
            "items": items
        })
    return JsonResponse(result, safe=False)


@csrf_exempt
def add_wishlist(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_email = data.get("user_email")
        product = data.get("product")

        if not user_email or not product:
            return JsonResponse({"status": "error", "message": "Missing data"})

        obj, created = WishlistItem.objects.get_or_create(
            user_email=user_email,
            product_id=product["id"],
            defaults={
                "product_name": product["name"],
                "price": product["price"],
                "image": product["image"]
            }
        )

        if not created:
            return JsonResponse({"status": "error", "message": "Already in wishlist"})

        return JsonResponse({"status": "success", "message": "Added to wishlist"})

    return JsonResponse({"status": "error", "message": "Invalid request"})


def get_wishlist(request, email):
    items = list(WishlistItem.objects.filter(user_email=email).values())
    return JsonResponse(items, safe=False)


@csrf_exempt
def remove_wishlist(request, email, product_id):
    if request.method == "DELETE":
        WishlistItem.objects.filter(user_email=email, product_id=product_id).delete()
        return JsonResponse({"status": "success", "message": "Removed from wishlist"})
    return JsonResponse({"status": "error", "message": "Invalid request"})


def get_dashboard(request, email):
    total_orders = Order.objects.filter(user_email=email).count()
    orders = Order.objects.filter(user_email=email)
    total_spent = sum(o.total for o in orders)
    wishlist_count = WishlistItem.objects.filter(user_email=email).count()
    recent_orders = []
    for order in orders.order_by('-created_at')[:5]:
        recent_orders.append({
            "id": order.id,
            "total": order.total,
            "payment": order.payment,
            "created_at": order.created_at.strftime("%d %b %Y")
        })

    try:
        user = User.objects.get(email=email)
        name = user.name
    except User.DoesNotExist:
        name = email

    return JsonResponse({
        "name": name,
        "total_orders": total_orders,
        "total_spent": total_spent,
        "wishlist_count": wishlist_count,
        "recent_orders": recent_orders
    })
