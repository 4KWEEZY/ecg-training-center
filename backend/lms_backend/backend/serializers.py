from rest_framework import serializers
from .models import User,OTPCode,Enrollment,Course, Module, Lesson, Resource, UserProgress, Announcement,TrainingSession, UserStats, LessonCompletion
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
import re

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=254)
    username = serializers.CharField(
        min_length=8,
        max_length=20,
        error_messages={
            'min_length': 'Username must be at least 8 characters.',
            'max_length': 'Username cannot exceed 20 characters.',
        }
    )
    password = serializers.CharField(write_only=True, min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters.',
        }
    )
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=10, min_length=10,
        error_messages={
            'min_length': 'Phone number must be exactly 10 digits.',
            'max_length': 'Phone number must be exactly 10 digits.',
        }
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Only digits are allowed.")
        return value

    def validate_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character (!@# etc)."
            )
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username')

        # Check if input is email or username
        try:
            if '@' in username_or_email:
                user = User.objects.get(email=username_or_email)
                attrs['username'] = user.username  # swap email for username
            else:
                user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "username": "No account found with this username or email."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "account": "This account has been disabled."
            })

        # Let parent handle password check and token generation
        data = super().validate(attrs)

        data['user'] = {
            'name': self.user.name,
            'username': self.user.username,
            'email': self.user.email,
            'phone_number': self.user.phone_number,
        }
        return data

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "No account found with this email."
            )
        return value

class PasswordResetVerifyOTPSerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6, min_length=6)

    def validate(self, data):
        try:
            otp = OTPCode.objects.filter(
                purpose='reset',
                is_used=False,
                code=data['otp_code']
            ).latest('created_at')
        except OTPCode.DoesNotExist:
            raise serializers.ValidationError({
                "otp_code": "Invalid OTP code."
            })

        if timezone.now() > otp.expiry:
            raise serializers.ValidationError({
                "otp_code": "OTP has expired. Please request a new one."
            })

        # Mark OTP as used
        otp.is_used = True
        otp.save()

        data['user'] = otp.user
        return data


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            data['user'] = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "email": "No account found with this email."
            })

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'name', 'username', 'email',
            'phone_number', 'date_joined', 'is_active'
        ]
        read_only_fields = ['id', 'username', 'email', 'date_joined', 'is_active']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'phone_number']

    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Only digits are allowed.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value



# serializers.py

from rest_framework import serializers
from .models import (
    Course, Module, Lesson, Resource, UserProgress, Announcement,
    TrainingSession, UserStats, LessonCompletion, Enrollment, User
)


class CourseSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    code = serializers.CharField()
    modules_count = serializers.IntegerField()
    is_active = serializers.BooleanField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'title': instance.title,
            'description': instance.description,
            'code': instance.code,
            'modules_count': instance.modules_count,
            'is_active': instance.is_active,
            'created_at': instance.created_at
        }

    def create(self, validated_data):
        return Course.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.code = validated_data.get('code', instance.code)
        instance.modules_count = validated_data.get('modules_count', instance.modules_count)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance


class ModuleSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    course = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_null=True)
    order = serializers.IntegerField()
    is_published = serializers.BooleanField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'course': instance.course.id,
            'title': instance.title,
            'description': instance.description,
            'order': instance.order,
            'is_published': instance.is_published,
            'created_at': instance.created_at
        }

    def create(self, validated_data):
        return Module.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.order = validated_data.get('order', instance.order)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.save()
        return instance


class LessonSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    module = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_null=True)
    order = serializers.IntegerField()
    duration_minutes = serializers.IntegerField()
    is_preview = serializers.BooleanField()
    is_published = serializers.BooleanField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'module': instance.module.id,
            'title': instance.title,
            'description': instance.description,
            'order': instance.order,
            'duration_minutes': instance.duration_minutes,
            'is_preview': instance.is_preview,
            'is_published': instance.is_published,
            'created_at': instance.created_at
        }

    def create(self, validated_data):
        return Lesson.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.order = validated_data.get('order', instance.order)
        instance.duration_minutes = validated_data.get('duration_minutes', instance.duration_minutes)
        instance.is_preview = validated_data.get('is_preview', instance.is_preview)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.save()
        return instance


class ResourceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    lesson = serializers.IntegerField()
    title = serializers.CharField()
    resource_type = serializers.CharField()
    file = serializers.CharField(required=False, allow_null=True)
    video_url = serializers.CharField(required=False, allow_null=True)
    order = serializers.IntegerField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'lesson': instance.lesson.id,
            'title': instance.title,
            'resource_type': instance.resource_type,
            'file': instance.file.url if instance.file else None,
            'video_url': instance.video_url,
            'order': instance.order,
            'created_at': instance.created_at
        }

    def create(self, validated_data):
        return Resource.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.resource_type = validated_data.get('resource_type', instance.resource_type)
        instance.file = validated_data.get('file', instance.file)
        instance.video_url = validated_data.get('video_url', instance.video_url)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        return instance


class LessonCompletionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.IntegerField()
    lesson = serializers.IntegerField()
    completed = serializers.BooleanField()
    completed_at = serializers.DateTimeField(required=False, allow_null=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.id,
            'lesson': instance.lesson.id,
            'completed': instance.completed,
            'completed_at': instance.completed_at
        }

    def create(self, validated_data):
        return LessonCompletion.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.completed = validated_data.get('completed', instance.completed)
        instance.completed_at = validated_data.get('completed_at', instance.completed_at)
        instance.save()
        return instance


class UserProgressSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    course = serializers.IntegerField()
    course_title = serializers.CharField(read_only=True)
    current_module = serializers.IntegerField(required=False, allow_null=True)
    module_title = serializers.CharField(read_only=True)
    current_lesson = serializers.IntegerField(required=False, allow_null=True)
    lesson_title = serializers.CharField(read_only=True)
    percentage = serializers.IntegerField()
    last_accessed = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'course': instance.course.id,
            'course_title': instance.course.title,
            'current_module': instance.current_module.id if instance.current_module else None,
            'module_title': instance.current_module.title if instance.current_module else None,
            'current_lesson': instance.current_lesson.id if instance.current_lesson else None,
            'lesson_title': instance.current_lesson.title if instance.current_lesson else None,
            'percentage': instance.percentage,
            'last_accessed': instance.last_accessed
        }

    def create(self, validated_data):
        return UserProgress.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.current_module_id = validated_data.get('current_module', instance.current_module_id)
        instance.current_lesson_id = validated_data.get('current_lesson', instance.current_lesson_id)
        instance.percentage = validated_data.get('percentage', instance.percentage)
        instance.save()
        return instance


class AnnouncementSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    tag = serializers.CharField()
    is_published = serializers.BooleanField()
    created_by = serializers.IntegerField(required=False, allow_null=True)
    created_by_name = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'title': instance.title,
            'description': instance.description,
            'tag': instance.tag,
            'is_published': instance.is_published,
            'created_by': instance.created_by.id if instance.created_by else None,
            'created_by_name': instance.created_by.name if instance.created_by else None,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }

    def create(self, validated_data):
        return Announcement.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.tag = validated_data.get('tag', instance.tag)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.save()
        return instance


class TrainingSessionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_null=True)
    course = serializers.IntegerField(required=False, allow_null=True)
    course_title = serializers.CharField(read_only=True)
    instructor = serializers.CharField()
    session_date = serializers.DateField()
    session_time = serializers.TimeField()
    venue = serializers.CharField()
    capacity = serializers.IntegerField()
    is_active = serializers.BooleanField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'title': instance.title,
            'description': instance.description,
            'course': instance.course.id if instance.course else None,
            'course_title': instance.course.title if instance.course else None,
            'instructor': instance.instructor,
            'session_date': instance.session_date,
            'session_time': instance.session_time,
            'venue': instance.venue,
            'capacity': instance.capacity,
            'is_active': instance.is_active,
            'created_at': instance.created_at
        }

    def create(self, validated_data):
        return TrainingSession.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.instructor = validated_data.get('instructor', instance.instructor)
        instance.session_date = validated_data.get('session_date', instance.session_date)
        instance.session_time = validated_data.get('session_time', instance.session_time)
        instance.venue = validated_data.get('venue', instance.venue)
        instance.capacity = validated_data.get('capacity', instance.capacity)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance


class UserStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    courses_completed = serializers.IntegerField()
    modules_completed = serializers.IntegerField()
    lessons_completed = serializers.IntegerField()
    evaluations_passed = serializers.IntegerField()
    badges_earned = serializers.IntegerField()
    last_updated = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.id,
            'total_enrollments': instance.total_enrollments,
            'courses_completed': instance.courses_completed,
            'modules_completed': instance.modules_completed,
            'lessons_completed': instance.lessons_completed,
            'evaluations_passed': instance.evaluations_passed,
            'badges_earned': instance.badges_earned,
            'last_updated': instance.last_updated
        }

    def create(self, validated_data):
        return UserStats.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.total_enrollments = validated_data.get('total_enrollments', instance.total_enrollments)
        instance.courses_completed = validated_data.get('courses_completed', instance.courses_completed)
        instance.modules_completed = validated_data.get('modules_completed', instance.modules_completed)
        instance.lessons_completed = validated_data.get('lessons_completed', instance.lessons_completed)
        instance.evaluations_passed = validated_data.get('evaluations_passed', instance.evaluations_passed)
        instance.badges_earned = validated_data.get('badges_earned', instance.badges_earned)
        instance.save()
        return instance


class EnrollmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.IntegerField()
    course = serializers.IntegerField()
    course_title = serializers.CharField(read_only=True)
    status = serializers.CharField()
    enrolled_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'user': instance.user.id,
            'course': instance.course.id,
            'course_title': instance.course.title,
            'status': instance.status,
            'enrolled_at': instance.enrolled_at
        }

    def create(self, validated_data):
        return Enrollment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance