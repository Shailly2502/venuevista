export const mockVenues = [
  {
    id: 1,
    name: "The Grand Luminary Ballroom",
    slug: "grand-luminary-ballroom",
    category: "Ballrooms",
    tagline: "Opulent crystal chandeliers and panoramic Arabian Sea views",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Worli Sea Face, South Mumbai",
    rating: 4.96,
    reviewCount: 142,
    pricePerHour: 35000,
    minHours: 4,
    capacity: 450,
    sqft: 8500,
    featured: true,
    badge: "Top Rated",
    verified: true,
    host: {
      name: "Pooja Singhania",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "100%",
      responseTime: "within an hour"
    },
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Full Audio/Visual & Concert Rig",
      "Royal Bridal & Green Suites",
      "Commercial Catering Kitchen",
      "Dedicated Valet Parking",
      "Gigabit WiFi",
      "Liquor License & Bar Setup",
      "Wheelchair Accessible",
      "Intelligent Moving Head Lighting"
    ],
    description: "The Grand Luminary Ballroom is South Mumbai's premier architectural jewel for high-profile galas, royal wedding receptions, and prestigious corporate celebrations. Featuring soaring 28-foot coffered ceilings, genuine hand-cut Austrian crystal chandeliers, and polished Italian marble flooring, this space blends historic elegance with state-of-the-art acoustic engineering overlooking the Arabian Sea.",
    rules: "Amplified sound permitted until 1:00 AM. In-house or approved licensed caterers required. Smoking strictly prohibited indoors."
  },
  {
    id: 2,
    name: "Skyline Horizon Glass Rooftop",
    slug: "skyline-horizon-rooftop",
    category: "Rooftops",
    tagline: "360° unobstructed city views with retractable climate glass dome",
    city: "Bengaluru",
    state: "Karnataka",
    address: "UB City, Vittal Mallya Road, Bengaluru",
    rating: 4.92,
    reviewCount: 98,
    pricePerHour: 28000,
    minHours: 3,
    capacity: 250,
    sqft: 6000,
    featured: true,
    badge: "Trending",
    verified: true,
    host: {
      name: "Rohan Nambiar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "98%",
      responseTime: "within 30 mins"
    },
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Retractable Glass Ceiling",
      "Built-in Island Cocktail Bar",
      "Lounge Firepits & Cabanas",
      "Pioneer DJ Console & Sound Rig",
      "Private Express VIP Elevator",
      "Sunset Photo Terrace",
      "High-speed WiFi"
    ],
    description: "Perched 35 stories above central Bengaluru at UB City, Skyline Horizon offers awe-inspiring panoramic vistas from Cubbon Park to the tech corridors. Equipped with a motorized glass canopy, the venue accommodates Bengaluru's pleasant weather year-round, making it a favorite for cocktail soirees, product launches, and startup celebrations.",
    rules: "Outdoor music volume adjusted after 11:00 PM. No open flames outside designated fire pits."
  },
  {
    id: 3,
    name: "Aura Creative Studio & Industrial Loft",
    slug: "aura-creative-studio-loft",
    category: "Lofts & Studios",
    tagline: "Sun-drenched loft with exposed brick and dual cyclorama wall",
    city: "Delhi NCR",
    state: "Delhi",
    address: "The Dhan Mill, Chhatarpur, New Delhi",
    rating: 4.88,
    reviewCount: 76,
    pricePerHour: 15000,
    minHours: 2,
    capacity: 120,
    sqft: 4200,
    featured: false,
    badge: "Creator Choice",
    verified: true,
    host: {
      name: "Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "99%",
      responseTime: "within 15 mins"
    },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "24ft White Cyclorama Wall",
      "Heavy Equipment Ramp Access",
      "Artisan Cafe & Espresso Bar",
      "Hair & Makeup Vanity Stations",
      "Modular Designer Furniture",
      "Automated Blackout Blinds",
      "Sonos Surround Audio"
    ],
    description: "Located inside New Delhi's artistic compound at Dhan Mill, Chhatarpur, Aura Loft features 20ft ceilings, exposed red brickwork, and north-facing factory windows that bathe the interior in diffuse natural daylight. Perfect for fashion previews, brand workshops, pop-up culinary experiences, and commercial film productions.",
    rules: "Clean-up required post event. Equipment load-in strictly through designated loading bay."
  },
  {
    id: 4,
    name: "The Royal Glasshouse & Botanical Estate",
    slug: "royal-glasshouse-botanical-estate",
    category: "Garden Estates",
    tagline: "Victorian glass conservatory set amidst royal Rajasthani palace gardens",
    city: "Jaipur",
    state: "Rajasthan",
    address: "Amer Palace Road, Kukas, Jaipur",
    rating: 4.98,
    reviewCount: 189,
    pricePerHour: 30000,
    minHours: 4,
    capacity: 350,
    sqft: 9000,
    featured: true,
    badge: "Eco-Luxe",
    verified: true,
    host: {
      name: "Jai Singh Rathore",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "100%",
      responseTime: "within 2 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Climate-controlled Glass Conservatory",
      "Fairy Lighting & Chandelier Canopy",
      "Sprawling Heritage Royal Lawn",
      "Bridal Shahi Pavilion",
      "Parking for 150 Vehicles",
      "Full Commercial Preparation Kitchen",
      "Dedicated Royal Concierge Team"
    ],
    description: "A royal sanctuary in Jaipur surrounded by lush specimen palms, fragrant mogra gardens, and stone lotus fountains. The glass dome allows guests to dine under the desert stars with climate-controlled luxury regardless of season. Revered for destination weddings, luxury brand launches, and anniversary celebrations.",
    rules: "Eco-friendly flower petals only. No open fires near botanical foliage."
  },
  {
    id: 5,
    name: "Vanguard Tech & Convention Auditorium",
    slug: "vanguard-convention-auditorium",
    category: "Conference Centers",
    tagline: "High-tech auditorium with dual 4K LED video walls & breakout suites",
    city: "Hyderabad",
    state: "Telangana",
    address: "Hitec City, Financial District, Hyderabad",
    rating: 4.91,
    reviewCount: 110,
    pricePerHour: 40000,
    minHours: 4,
    capacity: 600,
    sqft: 12000,
    featured: false,
    badge: "Enterprise",
    verified: true,
    host: {
      name: "Vikram Reddy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "97%",
      responseTime: "within an hour"
    },
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Dual 4K LED Screen Walls (40ft)",
      "Live Streaming Broadcast Studio",
      "Simultaneous Translation Booths",
      "High-density Enterprise Mesh WiFi (10Gbps)",
      "Tiered Ergonomic Executive Seating",
      "5 Executive Breakout Boardrooms",
      "Grand Dining & Exhibition Hall"
    ],
    description: "Purpose-built in Cyberabad for cutting-edge technology summits, investor pitch events, and global hybrid symposia. Vanguard provides seamless digital broadcasting, broadcast-quality camera feeds, and dedicated sound engineers to ensure flawlessly executed keynote presentations.",
    rules: "Dedicated AV operator included in booking. Setup access 1 hour prior to event start."
  },
  {
    id: 6,
    name: "The Bayfront Coastal Pavilion & Yacht Pier",
    slug: "bayfront-coastal-pavilion-goa",
    category: "Waterfront",
    tagline: "Spectacular waterfront event space with private luxury yacht docking",
    city: "Goa",
    state: "Goa",
    address: "Nerul Waterfront, Candolim, North Goa",
    rating: 4.94,
    reviewCount: 88,
    pricePerHour: 32000,
    minHours: 3,
    capacity: 320,
    sqft: 7200,
    featured: true,
    badge: "Waterfront",
    verified: true,
    host: {
      name: "Natasha D'Souza",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      isSuperhost: true,
      responseRate: "100%",
      responseTime: "within 30 mins"
    },
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Private Luxury Yacht Jetty",
      "Open-air Teak Wood Boardwalk",
      "Covered Sea Breeze Pavilion",
      "Tropical Sunset Cocktail Bar",
      "Customizable Ambient Uplighting",
      "Private Pier Security Detail",
      "Catering Staging Area"
    ],
    description: "Nestled along the scenic Nerul river waters in North Goa, The Bayfront Pavilion blends vibrant coastal energy with contemporary chic architecture. Host unforgettable sunset cocktails, gala dinners, or private celebrations with luxury catamarans arriving directly at your private pier.",
    rules: "Yacht docking permission must be requested 48 hours prior. Music to comply with local coastal authority guidelines."
  }
];

export const venueCategories = [
  { id: "All", label: "All Spaces", icon: "Sparkles" },
  { id: "Ballrooms", label: "Ballrooms", icon: "Building2" },
  { id: "Rooftops", label: "Rooftops", icon: "Sunset" },
  { id: "Garden Estates", label: "Garden Estates", icon: "Trees" },
  { id: "Lofts & Studios", label: "Lofts & Studios", icon: "Palette" },
  { id: "Conference Centers", label: "Conferences", icon: "Presentation" },
  { id: "Waterfront", label: "Waterfront", icon: "Waves" }
];
