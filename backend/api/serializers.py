from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Venue, Event, TicketTier, Seat, Booking, HostInquiry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'avatar', 'company', 'phone']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'role', 'company', 'phone', 'avatar']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email', '').strip().lower()
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Must include "email" and "password".')

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        data['user'] = user
        return data


class VenueSerializer(serializers.ModelSerializer):
    reviewCount = serializers.IntegerField(source='review_count', read_only=True)
    pricePerHour = serializers.FloatField(source='price_per_hour', read_only=True)
    minHours = serializers.IntegerField(source='min_hours', read_only=True)
    host = serializers.SerializerMethodField()

    class Meta:
        model = Venue
        fields = [
            'id',
            'name',
            'slug',
            'category',
            'tagline',
            'city',
            'state',
            'address',
            'rating',
            'reviewCount',
            'pricePerHour',
            'minHours',
            'capacity',
            'sqft',
            'featured',
            'badge',
            'verified',
            'host',
            'images',
            'amenities',
            'description',
            'rules',
        ]

    def get_host(self, obj):
        return {
            'name': obj.host_name or 'Verified Venue Host',
            'avatar': obj.host_avatar or 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            'isSuperhost': obj.host_is_superhost,
            'responseRate': obj.host_response_rate,
            'responseTime': obj.host_response_time,
        }


# ==============================================================================
# MODULE 2: Ticket Inventory Serializers
# ==============================================================================
class TicketTierSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    eventId = serializers.IntegerField(source='event.id', read_only=True)
    tierName = serializers.CharField(source='tier_name')
    price = serializers.FloatField()
    totalQuantity = serializers.IntegerField(source='total_quantity')
    soldQuantity = serializers.IntegerField(source='sold_quantity', default=0)
    reservedQuantity = serializers.IntegerField(source='reserved_quantity', default=0)
    availableQuantity = serializers.IntegerField(source='available_quantity', read_only=True)
    maxPerOrder = serializers.IntegerField(source='max_per_order', default=10)
    status = serializers.CharField(default='Active')
    perks = serializers.ListField(default=list, required=False)

    class Meta:
        model = TicketTier
        fields = [
            'id',
            'eventId',
            'tierName',
            'price',
            'totalQuantity',
            'soldQuantity',
            'reservedQuantity',
            'availableQuantity',
            'maxPerOrder',
            'status',
            'perks',
            'created_at',
        ]


# ==============================================================================
# MODULE 3: Seating Chart & Allocation Serializers
# ==============================================================================
class SeatSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    eventId = serializers.IntegerField(source='event.id', read_only=True)
    section = serializers.CharField()
    row = serializers.CharField()
    seatNumber = serializers.IntegerField(source='seat_number')
    seatCode = serializers.CharField(source='seat_code')
    tierId = serializers.IntegerField(source='tier.id', allow_null=True, required=False)
    tierName = serializers.CharField(source='tier.tier_name', allow_null=True, required=False, read_only=True)
    price = serializers.FloatField()
    status = serializers.CharField(default='available')
    allocatedToName = serializers.CharField(source='allocated_to.name', allow_null=True, read_only=True)
    bookingId = serializers.CharField(source='booking.booking_id', allow_null=True, read_only=True)

    class Meta:
        model = Seat
        fields = [
            'id',
            'eventId',
            'section',
            'row',
            'seatNumber',
            'seatCode',
            'tierId',
            'tierName',
            'price',
            'status',
            'allocatedToName',
            'bookingId',
            'allocated_at',
        ]


# ==============================================================================
# MODULE 1: Event Creation & Scheduling Serializers
# ==============================================================================
class EventSerializer(serializers.ModelSerializer):
    venueId = serializers.SerializerMethodField()
    venueName = serializers.CharField(source='venue_name', required=False)
    price = serializers.FloatField()
    endDate = serializers.CharField(source='end_date', required=False, allow_blank=True)
    endTime = serializers.CharField(source='end_time', required=False, allow_blank=True)
    scheduleType = serializers.CharField(source='schedule_type', required=False)
    scheduleSlots = serializers.ListField(source='schedule_slots', required=False)
    ticketTiers = TicketTierSerializer(source='ticket_tiers', many=True, read_only=True)
    totalSeats = serializers.SerializerMethodField()
    availableSeats = serializers.SerializerMethodField()
    bookedSeats = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'category',
            'venueId',
            'venueName',
            'city',
            'date',
            'endDate',
            'time',
            'endTime',
            'scheduleType',
            'status',
            'scheduleSlots',
            'price',
            'capacity',
            'attendees',
            'badge',
            'image',
            'description',
            'ticketTiers',
            'totalSeats',
            'availableSeats',
            'bookedSeats',
            'created_at',
        ]

    def get_venueId(self, obj):
        return obj.venue.id if obj.venue else None

    def get_totalSeats(self, obj):
        return obj.seats.count()

    def get_availableSeats(self, obj):
        return obj.seats.filter(status='available').count()

    def get_bookedSeats(self, obj):
        return obj.seats.filter(status='booked').count()


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    venueId = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    venue_name = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    endDate = serializers.CharField(source='end_date', required=False, allow_blank=True)
    endTime = serializers.CharField(source='end_time', required=False, allow_blank=True)
    scheduleType = serializers.CharField(source='schedule_type', required=False)
    scheduleSlots = serializers.ListField(source='schedule_slots', required=False)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'category',
            'venueId',
            'venue_name',
            'city',
            'date',
            'endDate',
            'time',
            'endTime',
            'scheduleType',
            'status',
            'scheduleSlots',
            'price',
            'capacity',
            'badge',
            'image',
            'description',
        ]

    def create(self, validated_data):
        venue_id = validated_data.pop('venueId', None)
        if venue_id:
            try:
                venue = Venue.objects.get(id=venue_id)
                validated_data['venue'] = venue
                if not validated_data.get('venue_name'):
                    validated_data['venue_name'] = venue.name
                if not validated_data.get('city'):
                    validated_data['city'] = venue.city
            except Venue.DoesNotExist:
                pass
        if not validated_data.get('venue_name'):
            validated_data['venue_name'] = 'Main Space'
        if not validated_data.get('city'):
            validated_data['city'] = 'India'
        return super().create(validated_data)

    def update(self, instance, validated_data):
        venue_id = validated_data.pop('venueId', None)
        if venue_id is not None:
            if venue_id:
                try:
                    instance.venue = Venue.objects.get(id=venue_id)
                except Venue.DoesNotExist:
                    pass
            else:
                instance.venue = None
        return super().update(instance, validated_data)


# ==============================================================================
# BOOKING & SALES SERIALIZERS
# ==============================================================================
class BookingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='booking_id')
    ticketCode = serializers.CharField(source='ticket_code')
    venueId = serializers.SerializerMethodField()
    eventId = serializers.SerializerMethodField()
    eventTitle = serializers.CharField(source='event.title', read_only=True, allow_null=True)
    ticketTierName = serializers.CharField(source='ticket_tier.tier_name', read_only=True, allow_null=True)
    ticketQuantity = serializers.IntegerField(source='ticket_quantity', default=1)
    seatsList = serializers.ListField(source='seats_list', default=list)
    venueName = serializers.CharField(source='venue_name')
    venueCity = serializers.CharField(source='venue_city')
    venueImage = serializers.CharField(source='venue_image')
    durationHours = serializers.IntegerField(source='duration_hours')
    eventType = serializers.CharField(source='event_type')
    baseRate = serializers.FloatField(source='base_rate')
    addOns = serializers.ListField(source='add_ons')
    totalAmount = serializers.FloatField(source='total_amount')
    paymentStatus = serializers.CharField(source='payment_status', default='Paid')
    hostName = serializers.CharField(source='host_name')
    qrPayload = serializers.CharField(source='qr_payload')
    createdAt = serializers.DateTimeField(source='created_at', format='%Y-%m-%dT%H:%M:%SZ', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'ticketCode',
            'venueId',
            'eventId',
            'eventTitle',
            'ticketTierName',
            'ticketQuantity',
            'seatsList',
            'venueName',
            'venueCity',
            'venueImage',
            'date',
            'startTime',
            'durationHours',
            'guests',
            'eventType',
            'baseRate',
            'addOns',
            'totalAmount',
            'paymentStatus',
            'status',
            'createdAt',
            'hostName',
            'qrPayload',
        ]

    def get_venueId(self, obj):
        return obj.venue.id if obj.venue else None

    def get_eventId(self, obj):
        return obj.event.id if obj.event else None


class HostInquirySerializer(serializers.ModelSerializer):
    venueName = serializers.CharField(source='venue_name', required=False)
    hourlyRate = serializers.DecimalField(source='hourly_rate', max_digits=12, decimal_places=2, required=False)

    class Meta:
        model = HostInquiry
        fields = [
            'id',
            'venueName',
            'category',
            'city',
            'address',
            'capacity',
            'hourlyRate',
            'email',
            'phone',
            'description',
            'status',
            'created_at',
        ]
