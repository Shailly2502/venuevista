from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=50, default='Event Organizer')
    avatar = models.URLField(max_length=1000, blank=True, default='')
    company = models.CharField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name or self.email} ({self.role})"


class Venue(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.CharField(max_length=100)
    tagline = models.CharField(max_length=500, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    rating = models.FloatField(default=5.0)
    review_count = models.IntegerField(default=0)
    price_per_hour = models.DecimalField(max_digits=12, decimal_places=2)
    min_hours = models.IntegerField(default=1)
    capacity = models.IntegerField(default=50)
    sqft = models.IntegerField(default=1000)
    featured = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True, default='')
    verified = models.BooleanField(default=True)
    
    # Host information
    host_name = models.CharField(max_length=255, blank=True, default='')
    host_avatar = models.URLField(max_length=1000, blank=True, default='')
    host_is_superhost = models.BooleanField(default=True)
    host_response_rate = models.CharField(max_length=50, default='100%')
    host_response_time = models.CharField(max_length=50, default='within an hour')
    
    images = models.JSONField(default=list, blank=True)
    amenities = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    rules = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-featured', '-rating', 'id']

    def __str__(self):
        return f"{self.name} - {self.city}"


# ==============================================================================
# MODULE 1: Event Creation & Scheduling
# ==============================================================================
class Event(models.Model):
    SCHEDULE_TYPES = (
        ('Single Day', 'Single Day'),
        ('Multi-Day', 'Multi-Day'),
        ('Recurring', 'Recurring'),
        ('Time Slots', 'Time Slots'),
    )

    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Scheduled', 'Scheduled'),
        ('Published', 'Published'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    organizer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='organized_events')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    venue_name = models.CharField(max_length=255)
    city = models.CharField(max_length=150)
    
    # Scheduling fields
    date = models.CharField(max_length=100) # Start Date e.g. "2026-12-14" or "Dec 14, 2026"
    end_date = models.CharField(max_length=100, blank=True, default='')
    time = models.CharField(max_length=100) # Start Time e.g. "09:00 AM" or "10:00"
    end_time = models.CharField(max_length=100, blank=True, default='05:00 PM')
    schedule_type = models.CharField(max_length=50, choices=SCHEDULE_TYPES, default='Single Day')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Published')
    schedule_slots = models.JSONField(default=list, blank=True) # Sessions / Agendas / Slots

    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField(default=100)
    attendees = models.IntegerField(default=0)
    badge = models.CharField(max_length=50, blank=True, default='')
    image = models.URLField(max_length=1000)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.title} ({self.status}) - {self.date}"


# ==============================================================================
# MODULE 2: Ticket Inventory Management
# ==============================================================================
class TicketTier(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Sold Out', 'Sold Out'),
        ('Paused', 'Paused'),
        ('Hidden', 'Hidden'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_tiers')
    tier_name = models.CharField(max_length=100) # e.g. 'VIP Platinum', 'General Admission', 'Early Bird', 'Executive Pass'
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_quantity = models.IntegerField(default=100)
    sold_quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    perks = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Active')
    max_per_order = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['price']

    @property
    def available_quantity(self):
        return max(0, self.total_quantity - self.sold_quantity - self.reserved_quantity)

    def __str__(self):
        return f"{self.tier_name} (₹{self.price}) - {self.event.title}"


# ==============================================================================
# BOOKING & SALES RECORD (Supports Module 4: Sales Reporting & Analytics)
# ==============================================================================
class Booking(models.Model):
    booking_id = models.CharField(max_length=100, unique=True)
    ticket_code = models.CharField(max_length=100, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    ticket_tier = models.ForeignKey(TicketTier, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    ticket_quantity = models.IntegerField(default=1)
    seats_list = models.JSONField(default=list, blank=True) # e.g. ["VIP-A-1", "VIP-A-2"]
    
    venue_name = models.CharField(max_length=255)
    venue_city = models.CharField(max_length=255)
    venue_image = models.URLField(max_length=1000, blank=True)
    date = models.CharField(max_length=50)
    startTime = models.CharField(max_length=50, blank=True, default='14:00')
    duration_hours = models.IntegerField(default=4)
    guests = models.IntegerField(default=50)
    event_type = models.CharField(max_length=255, default='Private Event')
    base_rate = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    add_ons = models.JSONField(default=list, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=50, default='Paid') # Paid, Refunded, Pending
    status = models.CharField(max_length=50, default='Confirmed')
    host_name = models.CharField(max_length=255, blank=True)
    qr_payload = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_id} - {self.venue_name} ({self.status})"


# ==============================================================================
# MODULE 3: Seating Chart and Allocation
# ==============================================================================
class Seat(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('booked', 'Booked'),
        ('blocked', 'Blocked'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='seats')
    section = models.CharField(max_length=100) # e.g., 'VIP Orchestra', 'Premium Stalls', 'Balcony Upper', 'General Floor'
    row = models.CharField(max_length=10) # e.g., 'A', 'B', 'C', 'D'
    seat_number = models.IntegerField() # e.g., 1, 2, 3...
    seat_code = models.CharField(max_length=50) # e.g., 'VIP-A-1'
    tier = models.ForeignKey(TicketTier, on_delete=models.SET_NULL, null=True, blank=True, related_name='seats')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    allocated_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='allocated_seats')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='allocated_seats')
    allocated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('event', 'section', 'row', 'seat_number')
        ordering = ['section', 'row', 'seat_number']

    def __str__(self):
        return f"{self.seat_code} [{self.status}] - {self.event.title}"


class HostInquiry(models.Model):
    venue_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=500, blank=True)
    capacity = models.IntegerField(default=100)
    hourly_rate = models.DecimalField(max_digits=12, decimal_places=2, default=25000)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='Pending Review')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Inquiry for {self.venue_name} by {self.email}"
