from rest_framework import serializers
from .models import User,OTPCode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone



class RegisterSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=254)
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True,min_length=8)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=10)

    def validate_username(self, value):

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate_phone_number(self, value):

        if not value.isdigit():
            raise serializers.ValidationError(
                "Only digits are allowed."
            )

        return value

    def validate(self, data):

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password":"Passwords do not match."}
            )

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