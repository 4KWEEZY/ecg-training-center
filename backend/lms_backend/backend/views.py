from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime, timedelta
from .serializers import (
    RegisterSerializer, CustomTokenObtainPairSerializer,
    PasswordResetRequestSerializer, PasswordResetVerifyOTPSerializer,
    PasswordResetConfirmSerializer, ProfileSerializer, ProfileUpdateSerializer,
    CourseSerializer, ModuleSerializer, LessonSerializer, ResourceSerializer,
    UserProgressSerializer, AnnouncementSerializer, TrainingSessionSerializer,
    UserStatsSerializer, LessonCompletionSerializer, EnrollmentSerializer
)
from .utils import send_otp_email
from .models import (
    User, Course, Module, Lesson, Resource, UserProgress, Announcement,
    TrainingSession, UserStats, LessonCompletion, Enrollment
)
# Create your views here.


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate tokens on registration
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Account created successfully.",
                    "user": {
                        "name": user.name,
                        "username": user.username,
                        "email": user.email,
                        "phone_number": user.phone_number,
                    },
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['email'])
            send_otp_email(user, purpose='reset')
            return Response(
                {"message": "OTP sent to your email."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetVerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetVerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response(
                {
                    "message": "OTP verified. You can now reset your password.",
                    "email": serializer.validated_data['user'].email
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"message": "Password reset successful. Please log in."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ── Dashboard ──
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        current_study = UserProgress.objects.filter(user=user).first()
        announcements = Announcement.objects.filter(is_published=True).order_by('-created_at')[:5]
        
        today = datetime.now().date()
        upcoming_sessions = TrainingSession.objects.filter(
            session_date__gte=today,
            session_date__lte=today + timedelta(days=30),
            is_active=True
        ).order_by('session_date', 'session_time')[:5]
        
        user_stats = UserStats.objects.filter(user=user).first()
        
        return Response({
            'current_study': UserProgressSerializer(current_study).data if current_study else None,
            'announcements': AnnouncementSerializer(announcements, many=True).data,
            'upcoming_sessions': TrainingSessionSerializer(upcoming_sessions, many=True).data,
            'user_stats': UserStatsSerializer(user_stats).data if user_stats else None,
        }, status=status.HTTP_200_OK)


# ── Courses ──
class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.filter(is_active=True).order_by('-created_at')
        return Response(CourseSerializer(courses, many=True).data, status=status.HTTP_200_OK)


class CourseCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.create(serializer.validated_data)
            return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        course = Course.objects.get(pk=pk)
        return Response(CourseSerializer(course).data, status=status.HTTP_200_OK)


class CourseUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        course = Course.objects.get(pk=pk)
        serializer = CourseSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            course = serializer.update(course, serializer.validated_data)
            return Response(CourseSerializer(course).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        course = Course.objects.get(pk=pk)
        course.delete()
        return Response({'message': 'Course deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── Modules ──
class ModuleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        modules = Module.objects.filter(course_id=course_id).order_by('order')
        return Response(ModuleSerializer(modules, many=True).data, status=status.HTTP_200_OK)


class ModuleCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, course_id):
        data = request.data.copy()
        data['course'] = course_id
        serializer = ModuleSerializer(data=data)
        if serializer.is_valid():
            module = serializer.create(serializer.validated_data)
            return Response(ModuleSerializer(module).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModuleDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id):
        module = Module.objects.get(pk=module_id, course_id=course_id)
        return Response(ModuleSerializer(module).data, status=status.HTTP_200_OK)


class ModuleUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, course_id, module_id):
        module = Module.objects.get(pk=module_id, course_id=course_id)
        serializer = ModuleSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            module = serializer.update(module, serializer.validated_data)
            return Response(ModuleSerializer(module).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModuleDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, course_id, module_id):
        module = Module.objects.get(pk=module_id, course_id=course_id)
        module.delete()
        return Response({'message': 'Module deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── Lessons ──
class LessonListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id):
        lessons = Lesson.objects.filter(module_id=module_id, module__course_id=course_id).order_by('order')
        return Response(LessonSerializer(lessons, many=True).data, status=status.HTTP_200_OK)


class LessonCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, course_id, module_id):
        data = request.data.copy()
        data['module'] = module_id
        serializer = LessonSerializer(data=data)
        if serializer.is_valid():
            lesson = serializer.create(serializer.validated_data)
            return Response(LessonSerializer(lesson).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id, lesson_id):
        lesson = Lesson.objects.get(pk=lesson_id, module_id=module_id, module__course_id=course_id)
        return Response(LessonSerializer(lesson).data, status=status.HTTP_200_OK)


class LessonUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, course_id, module_id, lesson_id):
        lesson = Lesson.objects.get(pk=lesson_id, module_id=module_id, module__course_id=course_id)
        serializer = LessonSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            lesson = serializer.update(lesson, serializer.validated_data)
            return Response(LessonSerializer(lesson).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, course_id, module_id, lesson_id):
        lesson = Lesson.objects.get(pk=lesson_id, module_id=module_id, module__course_id=course_id)
        lesson.delete()
        return Response({'message': 'Lesson deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── Resources ──
class ResourceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id, lesson_id):
        resources = Resource.objects.filter(lesson_id=lesson_id, lesson__module_id=module_id).order_by('order')
        return Response(ResourceSerializer(resources, many=True).data, status=status.HTTP_200_OK)


class ResourceCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, course_id, module_id, lesson_id):
        data = request.data.copy()
        data['lesson'] = lesson_id
        serializer = ResourceSerializer(data=data)
        if serializer.is_valid():
            resource = serializer.create(serializer.validated_data)
            return Response(ResourceSerializer(resource).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResourceUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, course_id, module_id, lesson_id, resource_id):
        resource = Resource.objects.get(pk=resource_id, lesson_id=lesson_id)
        serializer = ResourceSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            resource = serializer.update(resource, serializer.validated_data)
            return Response(ResourceSerializer(resource).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResourceDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, course_id, module_id, lesson_id, resource_id):
        resource = Resource.objects.get(pk=resource_id, lesson_id=lesson_id)
        resource.delete()
        return Response({'message': 'Resource deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── Announcements ──
class AnnouncementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        announcements = Announcement.objects.filter(is_published=True).order_by('-created_at')
        return Response(AnnouncementSerializer(announcements, many=True).data, status=status.HTTP_200_OK)


class AnnouncementCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            announcement = serializer.create(serializer.validated_data)
            return Response(AnnouncementSerializer(announcement).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnouncementUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        announcement = Announcement.objects.get(pk=pk)
        serializer = AnnouncementSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            announcement = serializer.update(announcement, serializer.validated_data)
            return Response(AnnouncementSerializer(announcement).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnouncementDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        announcement = Announcement.objects.get(pk=pk)
        announcement.delete()
        return Response({'message': 'Announcement deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── Training Sessions ──
class TrainingSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = datetime.now().date()
        sessions = TrainingSession.objects.filter(
            session_date__gte=today,
            is_active=True
        ).order_by('session_date', 'session_time')
        return Response(TrainingSessionSerializer(sessions, many=True).data, status=status.HTTP_200_OK)


class TrainingSessionCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = TrainingSessionSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.create(serializer.validated_data)
            return Response(TrainingSessionSerializer(session).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrainingSessionUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        session = TrainingSession.objects.get(pk=pk)
        serializer = TrainingSessionSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            session = serializer.update(session, serializer.validated_data)
            return Response(TrainingSessionSerializer(session).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrainingSessionDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        session = TrainingSession.objects.get(pk=pk)
        session.delete()
        return Response({'message': 'Training session deleted'}, status=status.HTTP_204_NO_CONTENT)


# ── User Progress ──
class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = UserProgress.objects.filter(user=request.user)
        return Response(UserProgressSerializer(progress, many=True).data, status=status.HTTP_200_OK)


class UserProgressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        progress = UserProgress.objects.get(pk=pk, user=request.user)
        serializer = UserProgressSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            progress = serializer.update(progress, serializer.validated_data)
            return Response(UserProgressSerializer(progress).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Lesson Completion ──
class LessonCompletionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = LessonCompletionSerializer(data=data)
        if serializer.is_valid():
            completion = serializer.create(serializer.validated_data)
            return Response(LessonCompletionSerializer(completion).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Enrollments ──
class UserCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user, status='active')
        return Response({
            'count': enrollments.count(),
            'courses': EnrollmentSerializer(enrollments, many=True).data
        }, status=status.HTTP_200_OK)


class EnrollmentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = EnrollmentSerializer(data=data)
        if serializer.is_valid():
            enrollment = serializer.create(serializer.validated_data)
            return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)