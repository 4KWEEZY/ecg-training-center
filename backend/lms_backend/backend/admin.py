# admin.py

from django.contrib import admin
from .models import (
    User, Course, Module, Lesson, Resource, Announcement,
    TrainingSession, UserStats, Enrollment, UserProgress, LessonCompletion, OTPCode
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'name', 'is_staff', 'is_active', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'name']
    readonly_fields = ['date_joined']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'code', 'modules_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'code']
    readonly_fields = ['created_at', 'updated_at']
    fields = ['title', 'description', 'code', 'modules_count', 'is_active', 'created_at', 'updated_at']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_published', 'created_at']
    list_filter = ['course', 'is_published', 'created_at']
    search_fields = ['title', 'course__title']
    readonly_fields = ['created_at']
    fields = ['course', 'title', 'description', 'order', 'is_published', 'created_at']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'duration_minutes', 'is_published', 'created_at']
    list_filter = ['module__course', 'is_published', 'is_preview', 'created_at']
    search_fields = ['title', 'module__title']
    readonly_fields = ['created_at']
    fields = ['module', 'title', 'description', 'order', 'duration_minutes', 'is_preview', 'is_published', 'created_at']


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'resource_type', 'order', 'created_at']
    list_filter = ['resource_type', 'lesson__module__course', 'created_at']
    search_fields = ['title', 'lesson__title']
    readonly_fields = ['created_at']
    fields = ['lesson', 'title', 'resource_type', 'file', 'video_url', 'order', 'created_at']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'is_published', 'created_by', 'created_at']
    list_filter = ['tag', 'is_published', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fields = ['title', 'description', 'tag', 'is_published', 'created_by', 'created_at', 'updated_at']

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(TrainingSession)
class TrainingSessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'instructor', 'session_date', 'session_time', 'venue', 'is_active']
    list_filter = ['course', 'is_active', 'session_date']
    search_fields = ['title', 'instructor', 'venue']
    readonly_fields = ['created_at']
    fields = ['title', 'description', 'course', 'instructor', 'session_date', 'session_time', 'venue', 'capacity', 'is_active', 'created_at']


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_enrollments', 'courses_completed', 'badges_earned', 'last_updated']
    list_filter = ['last_updated']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['last_updated']
    fields = ['user', 'total_enrollments', 'courses_completed', 'modules_completed', 'lessons_completed', 'evaluations_passed', 'badges_earned', 'last_updated']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'enrolled_at']
    list_filter = ['course', 'status', 'enrolled_at']
    search_fields = ['user__username', 'course__title']
    readonly_fields = ['enrolled_at']
    fields = ['user', 'course', 'status', 'enrolled_at', 'completed_at']


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'current_module', 'percentage', 'last_accessed']
    list_filter = ['course', 'percentage']
    search_fields = ['user__username', 'course__title']
    readonly_fields = ['last_accessed']
    fields = ['user', 'course', 'current_module', 'current_lesson', 'percentage', 'last_accessed']


@admin.register(LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed', 'completed_at']
    list_filter = ['completed', 'completed_at']
    search_fields = ['user__username', 'lesson__title']
    fields = ['user', 'lesson', 'completed', 'completed_at']


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'purpose', 'code', 'is_used', 'created_at', 'expiry']
    list_filter = ['purpose', 'is_used', 'created_at']
    search_fields = ['user__username', 'code']
    readonly_fields = ['created_at', 'code']
    fields = ['user', 'code', 'purpose', 'is_used', 'created_at', 'expiry']