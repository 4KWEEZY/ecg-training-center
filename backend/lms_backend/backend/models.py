from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.core.validators import RegexValidator
import secrets
import random

# Create your models here.
class UserManager(BaseUserManager):

    def get_by_natural_key(self, username):
        return self.get(username=username)

    def create_user(self, username, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(
            username,
            email,
            password,
            **extra_fields
        )


class User(AbstractBaseUser):

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    name = models.CharField(max_length=254)
    username = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=10, validators=[RegexValidator(r'^\d+$', 'Only digits are allowed.')])
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def __str__(self):
        return self.username