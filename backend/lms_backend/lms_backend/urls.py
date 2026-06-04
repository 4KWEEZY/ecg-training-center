"""
URL configuration for lms_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from backend.views import (
    RegisterView, LoginView, PasswordResetRequestView, PasswordResetVerifyOTPView,
    PasswordResetConfirmView, ProfileView, DashboardView,
    CourseListView, CourseCreateView, CourseDeleteView, CourseDetailView, CourseUpdateView,
    ModuleCreateView, ModuleDeleteView, ModuleDetailView, ModuleListView, ModuleUpdateView,
    LessonListView, LessonDetailView, LessonDeleteView, LessonCreateView, LessonUpdateView,
    ResourceListView, ResourceCreateView, ResourceDeleteView, ResourceUpdateView,
    AnnouncementCreateView, AnnouncementDeleteView, AnnouncementListView, AnnouncementUpdateView,
    TrainingSessionListView, TrainingSessionCreateView, TrainingSessionUpdateView, TrainingSessionDeleteView,
    UserProgressView, UserProgressUpdateView, LessonCompletionCreateView,
    UserCoursesView, EnrollmentCreateView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/password-reset/verify-otp/', PasswordResetVerifyOTPView.as_view(), name='password_reset_verify'),
    path('api/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    
    # Dashboard
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Courses
    path('api/courses/', CourseListView.as_view(), name='courses_list'),
    path('api/courses/create/', CourseCreateView.as_view(), name='course_create'),
    path('api/courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('api/courses/<int:pk>/update/', CourseUpdateView.as_view(), name='course_update'),
    path('api/courses/<int:pk>/delete/', CourseDeleteView.as_view(), name='course_delete'),
    
    # Modules
    path('api/courses/<int:course_id>/modules/', ModuleListView.as_view(), name='modules_list'),
    path('api/courses/<int:course_id>/modules/create/', ModuleCreateView.as_view(), name='module_create'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/', ModuleDetailView.as_view(), name='module_detail'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/update/', ModuleUpdateView.as_view(), name='module_update'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/delete/', ModuleDeleteView.as_view(), name='module_delete'),
    
    # Lessons
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/', LessonListView.as_view(), name='lessons_list'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/create/', LessonCreateView.as_view(), name='lesson_create'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/', LessonDetailView.as_view(), name='lesson_detail'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/update/', LessonUpdateView.as_view(), name='lesson_update'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/delete/', LessonDeleteView.as_view(), name='lesson_delete'),
    
    # Resources
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/resources/', ResourceListView.as_view(), name='resources_list'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/resources/create/', ResourceCreateView.as_view(), name='resource_create'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/resources/<int:resource_id>/update/', ResourceUpdateView.as_view(), name='resource_update'),
    path('api/courses/<int:course_id>/modules/<int:module_id>/lessons/<int:lesson_id>/resources/<int:resource_id>/delete/', ResourceDeleteView.as_view(), name='resource_delete'),
    
    # Announcements
    path('api/announcements/', AnnouncementListView.as_view(), name='announcements_list'),
    path('api/announcements/create/', AnnouncementCreateView.as_view(), name='announcement_create'),
    path('api/announcements/<int:pk>/update/', AnnouncementUpdateView.as_view(), name='announcement_update'),
    path('api/announcements/<int:pk>/delete/', AnnouncementDeleteView.as_view(), name='announcement_delete'),
    
    # Training Sessions
    path('api/sessions/', TrainingSessionListView.as_view(), name='sessions_list'),
    path('api/sessions/create/', TrainingSessionCreateView.as_view(), name='session_create'),
    path('api/sessions/<int:pk>/update/', TrainingSessionUpdateView.as_view(), name='session_update'),
    path('api/sessions/<int:pk>/delete/', TrainingSessionDeleteView.as_view(), name='session_delete'),
    
    # User Progress
    path('api/progress/', UserProgressView.as_view(), name='user_progress'),
    path('api/progress/<int:pk>/update/', UserProgressUpdateView.as_view(), name='progress_update'),
    
    # Lesson Completion
    path('api/lesson-completion/', LessonCompletionCreateView.as_view(), name='lesson_completion'),
    
    # Enrollments
    path('api/my-courses/', UserCoursesView.as_view(), name='my_courses'),
    path('api/enroll/', EnrollmentCreateView.as_view(), name='enrollment_create'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)