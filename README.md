# VenueVista — Luxury Venue & Event Booking Platform

**VenueVista** is a full-stack, enterprise-grade venue discovery, event reservation, and space management platform. It connects premier property owners with event planners, corporate organizers, and gala producers across India and beyond.

---

## 🏛️ Project Architecture

```
venuevista/
├── backend/                  # Django 5.2 REST Framework API
│   ├── api/                  # Core API app (Models, Views, Serializers, Admin)
│   │   ├── management/       # Commands (seed_data, etc.)
│   │   ├── migrations/       # Django migrations
│   │   ├── models.py         # User, Venue, Event, Booking, HostInquiry
│   │   ├── serializers.py    # DRF Serializers (CamelCase/SnakeCase mapped)
│   │   ├── views.py          # API Views (Auth, Venues, Events, Bookings)
│   │   └── urls.py           # Endpoint routing
│   ├── venuevista/           # Project settings & configuration
│   ├── db.sqlite3            # Pre-seeded SQLite database
│   ├── manage.py
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Vite + React 19 Single Page App
│   ├── src/
│   │   ├── api/              # Axios client & venueService
│   │   ├── components/       # UI Modals, Cards, Filters, Navbar, QR Display
│   │   ├── context/          # AuthContext & BookingContext (with backend sync)
│   │   ├── data/             # Rich fallback datasets (mockVenues, mockEvents)
│   │   └── App.jsx           # Main interactive dashboard
│   ├── package.json
│   └── vite.config.js
│
├── database/                 # Database Schema, Dumps & Migration Scripts
│   ├── schema.sql            # MySQL DDL table schemas & indexes
│   ├── seed_data.sql         # MySQL DML seed inserts with credentials
│   ├── venuevista_mysql_dump.sql  # Complete MySQL/phpMyAdmin import dump
│   ├── venuevista_sqlite.sql # Complete SQLite dump
│   ├── fixtures.json         # Django JSON fixtures
│   ├── export_db.py          # Database export automation utility
│   └── README.md             # Database architecture & ER diagram
│
├── start_all.bat             # 1-Click launcher for both backend & frontend
├── start_backend.bat         # 1-Click launcher for Django backend
├── start_frontend.bat        # 1-Click launcher for Vite frontend
└── README.md                 # Complete project documentation
```

---

## 🔑 Pre-Seeded Frontend Credentials

The platform includes pre-configured credentials matching the frontend demo accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Event Planner** | `elena.vance@eventcraft.com` | `Password123!` | Elena Vance (Vance Luxury Events) |
| **Venue Host** | `marcus@luminarygroup.com` | `Password123!` | Marcus Sterling (Luminary Venues NYC) |
| **Superuser / Admin** | `admin@venuevista.com` | `Password123!` | Administrator (`/admin/` dashboard) |

*You can sign in using these exact credentials or use the 1-click demo buttons in the Sign In modal.*

---

## 🚀 Quick Start (Windows)

### Option A: One-Click Startup (Recommended)
Simply double-click **`start_all.bat`** in the project root. This will:
1. Start the Django backend on `http://127.0.0.1:8000`
2. Start the Vite frontend on `http://localhost:5173`
3. Automatically launch VenueVista in your default web browser.

---

### Option B: Manual Terminal Execution

#### 1. Start the Backend API
```powershell
cd backend
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```
- API Base: `http://127.0.0.1:8000/api/`
- Admin Panel: `http://127.0.0.1:8000/admin/`

#### 2. Start the Frontend App
```powershell
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173/`

---

## 💾 Database Configuration & Options

The backend is configured to use **SQLite** by default (`backend/db.sqlite3`), requiring zero external database installations or password configurations.

### Switching to MySQL (Optional):
1. In `database/`, import `venuevista_mysql_dump.sql` into your MySQL server or phpMyAdmin.
2. In `backend/.env`, set:
   ```env
   DB_ENGINE=mysql
   DB_NAME=venuevista_db
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```
3. Restart the backend server.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login/` | `POST` | Authenticate by email & password, returns JWT tokens and user |
| `/api/auth/register/` | `POST` | Register a new user account with role |
| `/api/auth/me/` | `GET` | Get authenticated user profile (`Bearer <token>`) |
| `/api/auth/token/refresh/` | `POST` | Refresh access token |
| `/api/venues/` | `GET` | List all venues (filters: `category`, `q`, `location`, `maxPrice`, `guests`) |
| `/api/venues/<id>/` | `GET` | Get single venue details |
| `/api/events/` | `GET` | List public galas & summits (optional `category` filter) |
| `/api/bookings/` | `GET`, `POST` | List reservations / Create booking with QR pass |
| `/api/bookings/<id>/cancel/` | `POST` | Cancel a reservation |
| `/api/host-inquiries/` | `POST` | Submit host property onboarding application |

---

## 🧪 Testing

Run backend test suite:
```powershell
cd backend
.\venv\Scripts\python.exe manage.py test api
```

Run frontend production build:
```powershell
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
