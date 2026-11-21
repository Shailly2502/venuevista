from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    RegisterView,
    MeView,
    VenueListView,
    VenueDetailView,
    # Module 1: Event Creation & Scheduling
    EventListCreateView,
    EventDetailView,
    EventScheduleView,
    # Module 2: Ticket Inventory Management
    TicketTierListCreateView,
    TicketTierDetailView,
    TicketInventoryAdjustView,
    # Module 3: Seating Chart & Allocation
    EventSeatingLayoutView,
    SeatGenerateView,
    SeatAllocateView,
    SeatReleaseView,
    SeatBlockToggleView,
    # Module 4: Sales Reporting & Analytics
    AnalyticsOverviewView,
    AnalyticsEventsView,
    AnalyticsRevenueTrendsView,
    AnalyticsExportView,
    # Bookings & Inquiries
    BookingListCreateView,
    BookingCancelView,
    HostInquiryCreateView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Venue endpoints
    path('venues/', VenueListView.as_view(), name='venue-list'),
    path('venues/<str:pk>/', VenueDetailView.as_view(), name='venue-detail'),

    # MODULE 1: Event Creation & Scheduling Endpoints
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/<int:pk>/schedule/', EventScheduleView.as_view(), name='event-schedule'),

    # MODULE 2: Ticket Inventory Management Endpoints
    path('events/<int:event_id>/tickets/', TicketTierListCreateView.as_view(), name='event-ticket-tiers'),
    path('tickets/<int:pk>/', TicketTierDetailView.as_view(), name='ticket-tier-detail'),
    path('tickets/<int:pk>/adjust-inventory/', TicketInventoryAdjustView.as_view(), name='ticket-inventory-adjust'),

    # MODULE 3: Seating Chart and Allocation Endpoints
    path('events/<int:event_id>/seating/', EventSeatingLayoutView.as_view(), name='event-seating-layout'),
    path('events/<int:event_id>/seating/generate/', SeatGenerateView.as_view(), name='event-seating-generate'),
    path('events/<int:event_id>/seating/allocate/', SeatAllocateView.as_view(), name='event-seating-allocate'),
    path('events/<int:event_id>/seating/release/', SeatReleaseView.as_view(), name='event-seating-release'),
    path('seating/<int:seat_id>/block/', SeatBlockToggleView.as_view(), name='seat-block-toggle'),

    # MODULE 4: Sales Reporting & Analytics Endpoints
    path('analytics/overview/', AnalyticsOverviewView.as_view(), name='analytics-overview'),
    path('analytics/events/', AnalyticsEventsView.as_view(), name='analytics-events'),
    path('analytics/revenue-trends/', AnalyticsRevenueTrendsView.as_view(), name='analytics-revenue-trends'),
    path('analytics/export/', AnalyticsExportView.as_view(), name='analytics-export'),

    # Booking & Inquiry endpoints
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<str:booking_id>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('host-inquiries/', HostInquiryCreateView.as_view(), name='host-inquiry-create'),
]
