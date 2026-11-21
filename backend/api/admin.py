from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Venue, Event, TicketTier, Seat, Booking, HostInquiry


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'company', 'phone', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'name', 'company')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'role', 'avatar', 'company', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password', 'is_staff', 'is_active')}
        ),
    )


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'rating', 'price_per_hour', 'capacity', 'featured')
    list_filter = ('category', 'city', 'featured', 'verified')
    search_fields = ('name', 'city', 'state', 'tagline', 'description')
    prepopulated_fields = {'slug': ('name',)}


class TicketTierInline(admin.TabularInline):
    model = TicketTier
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'venue_name', 'city', 'date', 'schedule_type', 'status', 'price', 'capacity', 'attendees')
    list_filter = ('category', 'city', 'status', 'schedule_type')
    search_fields = ('title', 'venue_name', 'city')
    inlines = [TicketTierInline]


@admin.register(TicketTier)
class TicketTierAdmin(admin.ModelAdmin):
    list_display = ('tier_name', 'event', 'price', 'total_quantity', 'sold_quantity', 'status')
    list_filter = ('status', 'event')
    search_fields = ('tier_name', 'event__title')


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('seat_code', 'event', 'section', 'row', 'seat_number', 'price', 'status', 'allocated_to')
    list_filter = ('status', 'section', 'event')
    search_fields = ('seat_code', 'event__title')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'venue_name', 'date', 'ticket_quantity', 'total_amount', 'payment_status', 'status', 'created_at')
    list_filter = ('status', 'payment_status', 'date')
    search_fields = ('booking_id', 'ticket_code', 'venue_name', 'host_name')


@admin.register(HostInquiry)
class HostInquiryAdmin(admin.ModelAdmin):
    list_display = ('venue_name', 'category', 'city', 'email', 'phone', 'status', 'created_at')
    list_filter = ('category', 'city', 'status')
    search_fields = ('venue_name', 'email', 'phone', 'city')
