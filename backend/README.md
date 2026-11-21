# VenueVista Backend API (Django REST Framework)

VenueVista backend is powered by Django 5.2, Django REST Framework, SimpleJWT authentication, and CORS headers. It includes pre-seeded frontend credentials, complete venues catalog, curated events, booking engine, and host inquiry processing.

---

## 🚀 Quick Start

### 1. Activate & Start Django Development Server
From the project root:
```powershell
cd backend
.\venv\Scripts\python.exe manage.py runserver
```
The API will be available at: `http://127.0.0.1:8000/api/`  
The Django Admin panel will be available at: `http://127.0.0.1:8000/admin/`

## 🐬 MySQL Setup (recommended)

1. MySQL server start karo (Windows Services -> MySQL80).
2. `backend/.env` me `DB_ENGINE=mysql`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` set karo.
3. Project root se `setup_mysql.bat` chalao (ya `cd backend` -> `.\venv\Scripts\python.exe setup_mysql.py`).
   Ye DB create karta hai, `migrate` chalata hai aur demo data seed karta hai.
4. `start_backend.bat` se server chalao.

> `database/*.sql` dumps ko `migrate` ke saath mix mat karo.

---

## 🔑 Frontend Demo Credentials (Pre-Seeded)

The following accounts are pre-configured in the database and match the frontend:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Event Planner** | `elena.vance@eventcraft.com` | `Password123!` | Elena Vance (Vance Luxury Events) |
| **Venue Host** | `marcus@luminarygroup.com` | `Password123!` | Marcus Sterling (Luminary Venues NYC) |
| **Superuser / Admin** | `admin@venuevista.com` | `Password123!` | VenueVista Administrator |

You can use these credentials directly in the frontend Sign-In modal or click the 1-click demo buttons.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login/` - Accepts `{ email, password }`, returns JWT `access`, `refresh` tokens and user object.
- `POST /api/auth/register/` - Accepts `{ name, email, password, role, company, phone }`.
- `GET /api/auth/me/` - Returns profile for the authenticated bearer token.
- `POST /api/auth/token/refresh/` - Refresh expired access token.

### Venues
- `GET /api/venues/` - Lists all venues. Supports query params:
  - `category`: Filter by category (e.g., `Ballrooms`, `Rooftops`)
  - `searchQuery` or `q`: Full-text search across name, city, amenities, description
  - `location`: Filter by city or state
  - `maxPrice`: Filter by maximum hourly rate
  - `guests`: Filter by minimum guest capacity
- `GET /api/venues/<id_or_slug>/` - Venue details by ID or slug.

### Events
- `GET /api/events/` - Lists public summits, galas, and concert sessions.
- `GET /api/events/<id>/` - Event details.

### Bookings & Passes
- `GET /api/bookings/` - List user reservations.
- `POST /api/bookings/` - Create a booking with QR ticket payload.
- `POST /api/bookings/<id>/cancel/` - Cancel an existing reservation.

### Host Partner Inquiries
- `POST /api/host-inquiries/` - Submit host partnership & venue onboarding applications.

---

## 🛠️ Management Commands

To re-seed or reset initial demo users, venues, and events:
```powershell
cd backend
.\venv\Scripts\python.exe manage.py seed_data
```

To run test suites:
```powershell
cd backend
.\venv\Scripts\python.exe manage.py test api
```
