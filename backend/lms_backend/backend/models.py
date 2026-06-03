from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
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
    
class OTPCode(models.Model):
    PURPOSE_CHOICES = [
        ('2fa', '2FA Login'),
        ('reset', 'Password Reset'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_codes')
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry = models.DateTimeField()

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expiry

    def __str__(self):
        return f"{self.user.username} - {self.purpose} - {self.code}"
    

class Course(models.Model):
    title = models.CharField(max_length=254)
    description = models.TextField()
    code = models.CharField(max_length=20, unique=True)

    modules_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class Module(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(
        null=True,
        blank=True
    )
    order = models.PositiveIntegerField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title    
    
class Lesson(models.Model):
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(
        null=True,
        blank=True
    )
    order = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField(
        default=0
    )
    is_preview = models.BooleanField(
        default=False
    )
    is_published = models.BooleanField(
        default=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
    

class Resource(models.Model):

    RESOURCE_TYPES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('slide', 'Slide'),
        ('document', 'Document'),
    ]
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='resources'
    )
    title = models.CharField(max_length=255)
    resource_type = models.CharField(
        max_length=20,
        choices=RESOURCE_TYPES
    )
    file = models.FileField(
        upload_to='resources/',
        null=True,
        blank=True
    )
    video_url = models.URLField(
        null=True,
        blank=True
    )
    order = models.PositiveIntegerField(
        default=1
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
    
class LessonCompletion(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE
    )
    completed = models.BooleanField(
        default=False
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        unique_together = ('user', 'lesson')