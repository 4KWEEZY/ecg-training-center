# backend/utils.py
import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import OTPCode


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(user, purpose):
    otp_code = generate_otp()

    # Save OTP to database
    OTPCode.objects.create(
        user=user,
        code=otp_code,
        purpose=purpose,
        expiry=timezone.now() + timedelta(minutes=10)
    )

    # Email subject based on purpose
    if purpose == '2fa':
        subject = "Your ECG Training Center Login OTP"
        message = f"Your login OTP code is: {otp_code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email."
    else:
        subject = "Your ECG Training Center Password Reset OTP"
        message = f"Your password reset OTP code is: {otp_code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email."

    send_mail(
        subject=subject,
        message=message,
            from_email='ECG Training Center <onboarding@resend.dev>',
        recipient_list=[user.email],
        fail_silently=False,
    )

    return otp_code