from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.IntegerField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email


class Order(models.Model):
    user_email = models.EmailField()
    name = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=20, default='')
    address = models.TextField(default='')
    payment = models.CharField(max_length=50, default='')
    total = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user_email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    price = models.IntegerField()
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


class WishlistItem(models.Model):
    user_email = models.EmailField()
    product_id = models.IntegerField()
    product_name = models.CharField(max_length=200)
    price = models.IntegerField()
    image = models.CharField(max_length=500, blank=True)

    class Meta:
        unique_together = ('user_email', 'product_id')

    def __str__(self):
        return f"{self.user_email} - {self.product_name}"
