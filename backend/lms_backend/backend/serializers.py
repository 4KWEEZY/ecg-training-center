from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=254)
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
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
            raise serializers.ValidationError(
                "Passwords do not match."
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
        try:
            user = User.objects.get(username=attrs['username'])
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "username": "No account found with this username."
            })

        # Check if account is active
        if not user.is_active:
            raise serializers.ValidationError({
                "account": "This account has been disabled."
            })

        # Let the parent handle password check and token generation
        data = super().validate(attrs)

        # Add user data to response
        data['user'] = {
            'name': self.user.name,
            'username': self.user.username,
            'email': self.user.email,
            'phone_number': self.user.phone_number,
        }
        return data
