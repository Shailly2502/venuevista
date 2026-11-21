from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Venue, Event, TicketTier, Seat, Booking

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial database data with frontend credentials, venues, events, ticket inventory, seating, and analytics'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting VenueVista comprehensive database seeding...'))

        # 1. Seed Frontend Credential Users
        users_data = [
            {
                'email': 'elena.vance@eventcraft.com',
                'name': 'Elena Vance',
                'role': 'Event Planner',
                'company': 'Vance Luxury Events',
                'phone': '+1 (555) 234-5678',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'password': 'Password123!',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'marcus@luminarygroup.com',
                'name': 'Marcus Sterling',
                'role': 'Venue Host',
                'company': 'Luminary Venues NYC',
                'phone': '+1 (555) 890-1234',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'password': 'Password123!',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'admin@venuevista.com',
                'name': 'VenueVista Administrator',
                'role': 'Admin',
                'company': 'VenueVista Global',
                'phone': '+1 (555) 100-2000',
                'avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                'password': 'Password123!',
                'is_staff': True,
                'is_superuser': True,
            }
        ]

        created_users = {}
        for u in users_data:
            user, created = User.objects.get_or_create(
                email=u['email'],
                defaults={
                    'name': u['name'],
                    'role': u['role'],
                    'company': u['company'],
                    'phone': u['phone'],
                    'avatar': u['avatar'],
                    'is_staff': u['is_staff'],
                    'is_superuser': u['is_superuser'],
                }
            )
            user.set_password(u['password'])
            user.name = u['name']
            user.role = u['role']
            user.company = u['company']
            user.phone = u['phone']
            user.avatar = u['avatar']
            user.is_staff = u['is_staff']
            user.is_superuser = u['is_superuser']
            user.save()
            created_users[u['email']] = user
            status_text = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(f"  [User] {status_text} credential: {u['email']}"))

        # 2. Seed Venues
        venues_data = [
            {
                "id": 1,
                "name": "The Grand Luminary Ballroom",
                "slug": "grand-luminary-ballroom",
                "category": "Ballrooms",
                "tagline": "Opulent crystal chandeliers and panoramic Arabian Sea views",
                "city": "Mumbai",
                "state": "Maharashtra",
                "address": "Worli Sea Face, South Mumbai",
                "rating": 4.96,
                "review_count": 142,
                "price_per_hour": 35000,
                "min_hours": 4,
                "capacity": 450,
                "sqft": 8500,
                "featured": True,
                "badge": "Top Rated",
                "verified": True,
                "host_name": "Pooja Singhania",
                "host_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                "host_is_superhost": True,
                "host_response_rate": "100%",
                "host_response_time": "within an hour",
                "images": [
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80"
                ],
                "amenities": [
                    "Valet Parking for 200 Cars",
                    "Concert-Grade Bose Surround Sound",
                    "Intelligent Moving-Head Truss Lighting",
                    "Executive Green Rooms & VIP Dressing Suites",
                    "Private Sea-Facing Cocktail Terrace",
                    "Dedicated Commercial Kitchen Facilities",
                    "Fiber Optic Gigabit WiFi"
                ],
                "description": "An architectural jewel poised along Mumbai's illustrious Worli coastline. The Grand Luminary Ballroom offers 8,500 square feet of pillar-free luxury with Italian marble finishes and custom Belgian chandeliers.",
                "rules": "Sound limits apply after 11:30 PM on open terraces. Outside catering permitted with certified luxury vendors."
            },
            {
                "id": 2,
                "name": "Skyline Horizon Glass Rooftop",
                "slug": "skyline-horizon-glass-rooftop",
                "category": "Rooftops",
                "tagline": "360-degree metropolitan skyline with illuminated glass infinity edge",
                "city": "Bengaluru",
                "state": "Karnataka",
                "address": "Residency Road, Central Business District, Bengaluru",
                "rating": 4.92,
                "review_count": 98,
                "price_per_hour": 28000,
                "min_hours": 3,
                "capacity": 220,
                "sqft": 5200,
                "featured": True,
                "badge": "Trending",
                "verified": True,
                "host_name": "Arjun Kapoor",
                "host_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "host_is_superhost": True,
                "host_response_rate": "98%",
                "host_response_time": "within 30 mins",
                "images": [
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&auto=format&fit=crop&q=80"
                ],
                "amenities": [
                    "360-degree Glass Infinity Perimeter",
                    "Full Circular Artisanal Cocktail Bar",
                    "Weatherproof Retractable Glass Skylight",
                    "Pioneer Pro DJ Console Setup",
                    "Heated Lounge Seating Pods",
                    "Dedicated High-Speed Express Elevator Access"
                ],
                "description": "Perched on the 32nd floor in Bengaluru's vibrant core, Skyline Horizon merges cosmopolitan glamour with high-altitude tranquility.",
                "rules": "Non-smoking inside covered areas. Designated sky-lounge smoking terrace available."
            },
            {
                "id": 5,
                "name": "Vanguard Tech & Convention Auditorium",
                "slug": "vanguard-convention-auditorium",
                "category": "Conference Centers",
                "tagline": "High-tech auditorium with dual 4K LED video walls & breakout suites",
                "city": "Hyderabad",
                "state": "Telangana",
                "address": "Hitec City, Financial District, Hyderabad",
                "rating": 4.91,
                "review_count": 110,
                "price_per_hour": 40000,
                "min_hours": 4,
                "capacity": 600,
                "sqft": 12000,
                "featured": False,
                "badge": "Enterprise",
                "verified": True,
                "host_name": "Vikram Reddy",
                "host_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
                "host_is_superhost": True,
                "host_response_rate": "97%",
                "host_response_time": "within an hour",
                "images": [
                    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80"
                ],
                "amenities": [
                    "Dual 4K LED Screen Walls (40ft)",
                    "Live Streaming Broadcast Studio",
                    "Simultaneous Translation Booths",
                    "High-density Enterprise Mesh WiFi (10Gbps)",
                    "Tiered Ergonomic Executive Seating"
                ],
                "description": "Purpose-built in Cyberabad for cutting-edge technology summits, investor pitch events, and global hybrid symposia.",
                "rules": "Dedicated AV operator included in booking. Setup access 1 hour prior to event start."
            },
            {
                "id": 6,
                "name": "The Bayfront Coastal Pavilion & Yacht Pier",
                "slug": "bayfront-coastal-pavilion-goa",
                "category": "Waterfront",
                "tagline": "Spectacular waterfront event space with private luxury yacht docking",
                "city": "Goa",
                "state": "Goa",
                "address": "Nerul Waterfront, Candolim, North Goa",
                "rating": 4.94,
                "review_count": 88,
                "price_per_hour": 32000,
                "min_hours": 3,
                "capacity": 320,
                "sqft": 7200,
                "featured": True,
                "badge": "Waterfront",
                "verified": True,
                "host_name": "Natasha D'Souza",
                "host_avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
                "host_is_superhost": True,
                "host_response_rate": "100%",
                "host_response_time": "within 30 mins",
                "images": [
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80"
                ],
                "amenities": [
                    "Private Luxury Yacht Jetty",
                    "Open-air Teak Wood Boardwalk",
                    "Covered Sea Breeze Pavilion",
                    "Tropical Sunset Cocktail Bar"
                ],
                "description": "Nestled along the scenic Nerul river waters in North Goa, blending vibrant coastal energy with contemporary chic architecture.",
                "rules": "Yacht docking permission must be requested 48 hours prior."
            }
        ]

        venues_map = {}
        for vd in venues_data:
            vid = vd.pop('id')
            venue, created = Venue.objects.update_or_create(id=vid, defaults=vd)
            venues_map[vid] = venue
            self.stdout.write(self.style.SUCCESS(f"  [Venue] Seeded ID {vid}: {venue.name}"))

        # 3. Seed Events (MODULE 1: Event Creation & Scheduling)
        events_data = [
            {
                "id": 101,
                "title": "India AI & DeepTech Innovators Summit 2026",
                "category": "Technology",
                "venue_id": 5,
                "venue_name": "Vanguard Tech & Convention Auditorium",
                "city": "Hyderabad, Telangana",
                "date": "2026-12-14",
                "end_date": "2026-12-15",
                "time": "09:00 AM",
                "end_time": "06:00 PM",
                "schedule_type": "Multi-Day",
                "status": "Published",
                "schedule_slots": [
                    {"time": "09:00 AM - 10:30 AM", "title": "Opening Keynote: Sovereign AI & Autonomous Agents", "speaker": "Dr. Aarav Mehta (DeepMind)"},
                    {"time": "11:00 AM - 01:00 PM", "title": "Enterprise LLM Scaling & Production Architectures", "speaker": "Panel Discussion"},
                    {"time": "02:00 PM - 03:45 PM", "title": "DeepTech Founder Showcases & Pitch Sessions", "speaker": "Top 10 Indian AI Startups"},
                    {"time": "04:15 PM - 06:00 PM", "title": "Gala Networking Dinner & VC Fireside Chat", "speaker": "Key Ecosystem Leaders"}
                ],
                "price": 4999,
                "capacity": 500,
                "attendees": 412,
                "badge": "Almost Sold Out",
                "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
                "description": "Connect with India's top founders, AI researchers, and venture capitalists exploring the next era of autonomous intelligence and enterprise computing."
            },
            {
                "id": 102,
                "title": "Sunset Symphony & Reserve Wine Soirée",
                "category": "Music & Dining",
                "venue_id": 2,
                "venue_name": "Skyline Horizon Glass Rooftop",
                "city": "Bengaluru, Karnataka",
                "date": "2026-12-20",
                "end_date": "2026-12-20",
                "time": "05:30 PM",
                "end_time": "10:00 PM",
                "schedule_type": "Single Day",
                "status": "Published",
                "schedule_slots": [
                    {"time": "05:30 PM - 06:30 PM", "title": "Welcome Cocktail & Twilight Rooftop Reception", "speaker": "Sommelier Selection"},
                    {"time": "06:30 PM - 08:30 PM", "title": "Live Acoustic Chamber Orchestra Performance", "speaker": "Bengaluru Philharmonic Quintet"},
                    {"time": "08:30 PM - 10:00 PM", "title": "Gourmet Tapas & Reserve Vintage Tasting", "speaker": "Executive Chef Marco"}
                ],
                "price": 2499,
                "capacity": 220,
                "attendees": 185,
                "badge": "Featured Event",
                "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
                "description": "An enchanting evening featuring live acoustic chamber musicians, sommelier-guided reserve wines, and panoramic twilight views of Bengaluru."
            },
            {
                "id": 103,
                "title": "Royal Heritage Haute Couture Gala",
                "category": "Fashion & Art",
                "venue_id": 1,
                "venue_name": "The Grand Luminary Ballroom",
                "city": "Mumbai, Maharashtra",
                "date": "2027-01-15",
                "end_date": "2027-01-15",
                "time": "07:00 PM",
                "end_time": "11:30 PM",
                "schedule_type": "Single Day",
                "status": "Scheduled",
                "schedule_slots": [
                    {"time": "07:00 PM - 08:00 PM", "title": "Red Carpet Arrival & Media Showcase", "speaker": "Celebrity Hosts"},
                    {"time": "08:00 PM - 09:30 PM", "title": "Runway Collection Showcase", "speaker": "Couture Houses"},
                    {"time": "09:30 PM - 11:30 PM", "title": "Grand Banquet & Designer Auction", "speaker": "Master of Ceremonies"}
                ],
                "price": 5999,
                "capacity": 400,
                "attendees": 310,
                "badge": "Black Tie",
                "image": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80",
                "description": "Experience premier winter collections from India's celebrated designers in an atmosphere of crystal chandeliers and gourmet fine dining overlooking the Arabian Sea."
            },
            {
                "id": 104,
                "title": "Acoustic Nights by the Coastal Pier",
                "category": "Live Music",
                "venue_id": 6,
                "venue_name": "The Bayfront Coastal Pavilion & Yacht Pier",
                "city": "Goa",
                "date": "2027-01-22",
                "end_date": "2027-01-22",
                "time": "06:30 PM",
                "end_time": "11:00 PM",
                "schedule_type": "Single Day",
                "status": "Published",
                "schedule_slots": [
                    {"time": "06:30 PM - 07:30 PM", "title": "Sunset Yacht Cruise & Boarding", "speaker": "Pier Crew"},
                    {"time": "07:30 PM - 09:30 PM", "title": "Indie-Folk Band Live Set", "speaker": "The Coastal Troubadours"},
                    {"time": "09:30 PM - 11:00 PM", "title": "Beachfront Bonfire & DJ Jam", "speaker": "DJ Ryan"}
                ],
                "price": 1499,
                "capacity": 300,
                "attendees": 190,
                "badge": "Popular",
                "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
                "description": "Indie-folk melodies, tropical craft cocktails, and gentle river breezes under the starlit canopy of Candolim, Goa."
            }
        ]

        events_map = {}
        for ed in events_data:
            eid = ed.pop('id')
            vid = ed.pop('venue_id', None)
            venue_obj = venues_map.get(vid)
            event, created = Event.objects.update_or_create(
                id=eid,
                defaults={**ed, 'venue': venue_obj, 'organizer': created_users.get('elena.vance@eventcraft.com')}
            )
            events_map[eid] = event
            self.stdout.write(self.style.SUCCESS(f"  [Event] Seeded ID {eid}: {event.title}"))

        # 4. Seed Ticket Tiers (MODULE 2: Ticket Inventory Management)
        tiers_config = [
            # For Event 101 (AI Summit)
            {'event_id': 101, 'tier_name': 'VIP All-Access Pass', 'price': 9999, 'total_quantity': 100, 'sold_quantity': 88, 'perks': ['Front-row VIP seating', 'Exclusive Speakers Lounge', 'Dinner Banquet with VCs', 'Fast-track badge pickup']},
            {'event_id': 101, 'tier_name': 'Standard Delegate', 'price': 4999, 'total_quantity': 300, 'sold_quantity': 264, 'perks': ['Access to all keynote tracks', 'Lunch & High Tea', 'Exhibition floor pass']},
            {'event_id': 101, 'tier_name': 'Early Bird Student / Researcher', 'price': 1999, 'total_quantity': 100, 'sold_quantity': 60, 'perks': ['General session seating', 'Conference Digital Kit']},

            # For Event 102 (Sunset Symphony)
            {'event_id': 102, 'tier_name': 'VIP Infinity Table', 'price': 4499, 'total_quantity': 50, 'sold_quantity': 45, 'perks': ['Edge-of-rooftop reserved table', 'Bottle of Reserve Vintage Champagne', 'Artisanal Tapas platter']},
            {'event_id': 102, 'tier_name': 'General Admission', 'price': 2499, 'total_quantity': 170, 'sold_quantity': 140, 'perks': ['Lounge seating access', '2 complimentary wine tokens', 'Live concert entrance']},

            # For Event 103 (Gala)
            {'event_id': 103, 'tier_name': 'Front-Row Runway Patron', 'price': 9999, 'total_quantity': 80, 'sold_quantity': 72, 'perks': ['Front-row seat along runway', 'Champagne welcome', 'Gala dinner menu']},
            {'event_id': 103, 'tier_name': 'Grand Ballroom Tier', 'price': 5999, 'total_quantity': 320, 'sold_quantity': 238, 'perks': ['Tiered gala seating', 'Four-course seated dinner', 'Afterparty access']},

            # For Event 104 (Goa Acoustic)
            {'event_id': 104, 'tier_name': 'VIP Yacht & Pier Deck', 'price': 2999, 'total_quantity': 60, 'sold_quantity': 50, 'perks': ['Boardwalk private lounge', 'Unlimited cocktails', 'Fast boat ferry transfer']},
            {'event_id': 104, 'tier_name': 'General Pier Entry', 'price': 1499, 'total_quantity': 240, 'sold_quantity': 140, 'perks': ['Pier access', '1 Craft beverage', 'Beachfront bonfire']}
        ]

        ticket_tiers_map = {}
        for tc in tiers_config:
            eid = tc.pop('event_id')
            event_obj = events_map.get(eid)
            tier, _ = TicketTier.objects.update_or_create(
                event=event_obj,
                tier_name=tc['tier_name'],
                defaults=tc
            )
            ticket_tiers_map[f"{eid}_{tier.tier_name}"] = tier
            self.stdout.write(self.style.SUCCESS(f"  [TicketTier] {tier.tier_name} ({tier.available_quantity} available / {tier.total_quantity})"))

        # 5. Seed Seating Chart & Allocations (MODULE 3: Seating Chart & Allocation)
        for eid, event_obj in events_map.items():
            rows = ['A', 'B', 'C', 'D', 'E']
            seats_per_row = 8
            vip_tier = event_obj.ticket_tiers.first()
            gen_tier = event_obj.ticket_tiers.last()

            for r_idx, row in enumerate(rows):
                if r_idx < 2:
                    section = 'VIP Front'
                    tier_obj = vip_tier
                    price = float(vip_tier.price if vip_tier else event_obj.price * 1.5)
                elif r_idx < 4:
                    section = 'Premium Center'
                    tier_obj = gen_tier
                    price = float(event_obj.price * 1.2)
                else:
                    section = 'General Hall'
                    tier_obj = gen_tier
                    price = float(gen_tier.price if gen_tier else event_obj.price)

                for s_num in range(1, seats_per_row + 1):
                    seat_code = f"{row}{s_num}"
                    # Pre-allocate or book some seats for realism
                    if s_num in [1, 2] and row in ['A', 'B']:
                        seat_status = 'booked'
                    elif s_num == 4 and row == 'A':
                        seat_status = 'reserved'
                    elif s_num == 8 and row == 'E':
                        seat_status = 'blocked'
                    else:
                        seat_status = 'available'

                    Seat.objects.update_or_create(
                        event=event_obj,
                        section=section,
                        row=row,
                        seat_number=s_num,
                        defaults={
                            'seat_code': seat_code,
                            'tier': tier_obj,
                            'price': price,
                            'status': seat_status,
                        }
                    )
            self.stdout.write(self.style.SUCCESS(f"  [Seating] Seeded 40 interactive seats for event ID {eid}"))

        # 6. Seed Bookings & Sales Records (MODULE 4: Sales Reporting & Analytics)
        planner_user = created_users.get('elena.vance@eventcraft.com')
        sample_bookings = [
            {
                'booking_id': 'BK-2026-8819',
                'ticket_code': 'VV-8819-MUM-LUM',
                'user': planner_user,
                'venue': venues_map.get(1),
                'event': events_map.get(103),
                'ticket_tier': ticket_tiers_map.get('103_Front-Row Runway Patron'),
                'ticket_quantity': 4,
                'seats_list': ['A1', 'A2', 'A3', 'A4'],
                'venue_name': 'The Grand Luminary Ballroom',
                'venue_city': 'Mumbai, Maharashtra',
                'venue_image': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
                'date': '2027-01-15',
                'startTime': '19:00',
                'duration_hours': 5,
                'guests': 4,
                'event_type': 'Runway Gala Patron Reservation',
                'base_rate': 39996,
                'add_ons': ['Champagne Table Service', 'VIP Limousine Escort'],
                'total_amount': 48000,
                'payment_status': 'Paid',
                'status': 'Confirmed',
                'host_name': 'Pooja Singhania',
                'qr_payload': 'https://venuevista.internal/verify/BK-2026-8819?code=VV-8819-MUM-LUM'
            },
            {
                'booking_id': 'BK-2026-9102',
                'ticket_code': 'VV-9102-HYD-AI',
                'user': planner_user,
                'venue': venues_map.get(5),
                'event': events_map.get(101),
                'ticket_tier': ticket_tiers_map.get('101_VIP All-Access Pass'),
                'ticket_quantity': 2,
                'seats_list': ['A1', 'A2'],
                'venue_name': 'Vanguard Tech & Convention Auditorium',
                'venue_city': 'Hyderabad, Telangana',
                'venue_image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
                'date': '2026-12-14',
                'startTime': '09:00',
                'duration_hours': 8,
                'guests': 2,
                'event_type': 'Tech Summit VIP Delegate',
                'base_rate': 19998,
                'add_ons': ['Private Meeting Pod Access'],
                'total_amount': 22500,
                'payment_status': 'Paid',
                'status': 'Confirmed',
                'host_name': 'Vikram Reddy',
                'qr_payload': 'https://venuevista.internal/verify/BK-2026-9102?code=VV-9102-HYD-AI'
            },
            {
                'booking_id': 'BK-2026-7450',
                'ticket_code': 'VV-7450-BLR-ROOF',
                'user': planner_user,
                'venue': venues_map.get(2),
                'event': events_map.get(102),
                'ticket_tier': ticket_tiers_map.get('102_VIP Infinity Table'),
                'ticket_quantity': 2,
                'seats_list': ['B1', 'B2'],
                'venue_name': 'Skyline Horizon Glass Rooftop',
                'venue_city': 'Bengaluru, Karnataka',
                'venue_image': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
                'date': '2026-12-20',
                'startTime': '17:30',
                'duration_hours': 4,
                'guests': 2,
                'event_type': 'Rooftop Symphony Soirée',
                'base_rate': 8998,
                'add_ons': ['Sommelier Reserve Pairings'],
                'total_amount': 12000,
                'payment_status': 'Paid',
                'status': 'Confirmed',
                'host_name': 'Arjun Kapoor',
                'qr_payload': 'https://venuevista.internal/verify/BK-2026-7450?code=VV-7450-BLR-ROOF'
            }
        ]

        for bd in sample_bookings:
            bid = bd.pop('booking_id')
            booking, _ = Booking.objects.update_or_create(booking_id=bid, defaults=bd)
            self.stdout.write(self.style.SUCCESS(f"  [Booking] Seeded Booking {bid} (₹{booking.total_amount})"))

        self.stdout.write(self.style.SUCCESS('\nVenueVista backend successfully seeded across all 4 modules!'))
