from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Venue, Event, TicketTier, Seat, Booking, HostInquiry

User = get_user_model()


class VenueVistaModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='elena.vance@eventcraft.com',
            password='Password123!',
            name='Elena Vance',
            role='Event Planner',
            company='Vance Luxury Events',
            phone='+1 (555) 234-5678'
        )
        self.venue = Venue.objects.create(
            name='The Grand Luminary Ballroom',
            slug='grand-luminary-ballroom',
            category='Ballrooms',
            city='Mumbai',
            state='Maharashtra',
            address='Worli Sea Face',
            rating=4.96,
            review_count=142,
            price_per_hour=35000,
            min_hours=4,
            capacity=450,
            sqft=8500,
            featured=True,
            images=['https://example.com/img1.jpg'],
            amenities=['WiFi', 'Valet']
        )
        self.event = Event.objects.create(
            title='Tech Summit 2026',
            category='Technology',
            venue=self.venue,
            venue_name=self.venue.name,
            city='Mumbai',
            date='2026-12-14',
            time='09:00 AM',
            end_date='2026-12-15',
            end_time='06:00 PM',
            schedule_type='Multi-Day',
            status='Published',
            price=4999,
            capacity=200,
            attendees=50,
            image='https://example.com/event.jpg',
            schedule_slots=[
                {'time': '09:00 AM', 'title': 'Keynote', 'speaker': 'Dr. Rao'}
            ]
        )
        self.tier = TicketTier.objects.create(
            event=self.event,
            tier_name='VIP Platinum',
            price=9999,
            total_quantity=50,
            sold_quantity=10,
            perks=['VIP Access', 'Lounge'],
            status='Active'
        )
        self.seat = Seat.objects.create(
            event=self.event,
            section='VIP Front',
            row='A',
            seat_number=1,
            seat_code='A1',
            tier=self.tier,
            price=9999,
            status='available'
        )

    # =========================================================================
    # CORE AUTH & VENUE TESTS
    # =========================================================================
    def test_auth_login_and_me(self):
        login_res = self.client.post('/api/auth/login/', {
            'email': 'elena.vance@eventcraft.com',
            'password': 'Password123!'
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        token = login_res.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        me_res = self.client.get('/api/auth/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['name'], 'Elena Vance')

    def test_venue_list_and_detail(self):
        res = self.client.get('/api/venues/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

        detail_res = self.client.get(f'/api/venues/{self.venue.id}/')
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_res.data['slug'], 'grand-luminary-ballroom')

    # =========================================================================
    # MODULE 1: EVENT CREATION AND SCHEDULING TESTS
    # =========================================================================
    def test_module1_event_creation(self):
        response = self.client.post('/api/events/', {
            'title': 'AI Leadership Gala 2027',
            'category': 'Conferences',
            'venueId': self.venue.id,
            'date': '2027-02-10',
            'endDate': '2027-02-11',
            'time': '10:00 AM',
            'endTime': '05:00 PM',
            'scheduleType': 'Multi-Day',
            'price': 7500,
            'capacity': 150,
            'image': 'https://example.com/gala.jpg',
            'description': 'Executive AI summit for enterprise leaders.',
            'scheduleSlots': [
                {'time': '10:00 AM', 'title': 'Opening Address', 'speaker': 'Chief Scientist'},
                {'time': '02:00 PM', 'title': 'Roundtable Session', 'speaker': 'CTO Panel'}
            ]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'AI Leadership Gala 2027')
        self.assertEqual(response.data['scheduleType'], 'Multi-Day')
        self.assertEqual(len(response.data['scheduleSlots']), 2)

    def test_module1_event_reschedule(self):
        response = self.client.post(f'/api/events/{self.event.id}/schedule/', {
            'date': '2026-12-18',
            'time': '11:00 AM',
            'scheduleSlots': [
                {'time': '11:00 AM', 'title': 'Updated Keynote'}
            ]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['event']['date'], '2026-12-18')
        self.assertEqual(response.data['event']['time'], '11:00 AM')

    # =========================================================================
    # MODULE 2: TICKET INVENTORY MANAGEMENT TESTS
    # =========================================================================
    def test_module2_ticket_inventory_list_and_create(self):
        # List tiers
        res = self.client.get(f'/api/events/{self.event.id}/tickets/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        # Create tier
        create_res = self.client.post(f'/api/events/{self.event.id}/tickets/', {
            'tierName': 'General Admission',
            'price': 4999,
            'totalQuantity': 100,
            'perks': ['Entry Badge', 'Free Lunch']
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_res.data['tierName'], 'General Admission')
        self.assertEqual(create_res.data['availableQuantity'], 100)

    def test_module2_ticket_inventory_adjust_stock(self):
        res = self.client.post(f'/api/tickets/{self.tier.id}/adjust-inventory/', {
            'delta': 20
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['totalQuantity'], 70)
        self.assertEqual(res.data['availableQuantity'], 60)

    # =========================================================================
    # MODULE 3: SEATING CHART AND ALLOCATION TESTS
    # =========================================================================
    def test_module3_seating_layout_and_generation(self):
        # Layout query
        res = self.client.get(f'/api/events/{self.event.id}/seating/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('sections', res.data)
        self.assertIn('summary', res.data)
        self.assertEqual(res.data['summary']['available'], 1)

        # Generate seats
        gen_res = self.client.post(f'/api/events/{self.event.id}/seating/generate/', {
            'capacity': 30,
            'reset': True
        }, format='json')
        self.assertEqual(gen_res.status_code, status.HTTP_201_CREATED)
        self.assertGreater(gen_res.data['totalSeats'], 10)

    def test_module3_seat_allocation_and_release(self):
        # Allocate seat A1
        alloc_res = self.client.post(f'/api/events/{self.event.id}/seating/allocate/', {
            'seatCodes': ['A1']
        }, format='json')
        self.assertEqual(alloc_res.status_code, status.HTTP_200_OK)
        self.seat.refresh_from_db()
        self.assertEqual(self.seat.status, 'booked')

        # Release seat A1
        release_res = self.client.post(f'/api/events/{self.event.id}/seating/release/', {
            'seatCodes': ['A1']
        }, format='json')
        self.assertEqual(release_res.status_code, status.HTTP_200_OK)
        self.seat.refresh_from_db()
        self.assertEqual(self.seat.status, 'available')

    def test_module3_seat_block_toggle(self):
        toggle_res = self.client.post(f'/api/seating/{self.seat.id}/block/')
        self.assertEqual(toggle_res.status_code, status.HTTP_200_OK)
        self.seat.refresh_from_db()
        self.assertEqual(self.seat.status, 'blocked')

    # =========================================================================
    # MODULE 4: SALES REPORTING AND ANALYTICS TESTS
    # =========================================================================
    def test_module4_sales_analytics_overview(self):
        # Create a confirmed booking
        Booking.objects.create(
            booking_id='BK-TEST-1',
            ticket_code='VV-TEST-1',
            user=self.user,
            venue=self.venue,
            event=self.event,
            ticket_tier=self.tier,
            ticket_quantity=2,
            seats_list=['A1', 'A2'],
            venue_name=self.venue.name,
            venue_city=self.venue.city,
            total_amount=19998,
            status='Confirmed'
        )

        overview_res = self.client.get('/api/analytics/overview/')
        self.assertEqual(overview_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(overview_res.data['totalRevenue'], 19998)
        self.assertGreaterEqual(overview_res.data['totalOrders'], 1)
        self.assertIn('occupancyRate', overview_res.data)

        # Event breakdown
        events_res = self.client.get('/api/analytics/events/')
        self.assertEqual(events_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(events_res.data), 1)

        # Revenue trends
        trends_res = self.client.get('/api/analytics/revenue-trends/')
        self.assertEqual(trends_res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(trends_res.data, list)

        # CSV report export
        export_res = self.client.get('/api/analytics/export/')
        self.assertEqual(export_res.status_code, status.HTTP_200_OK)
        self.assertEqual(export_res['Content-Type'], 'text/csv')
