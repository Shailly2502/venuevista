-- VenueVista SQLite Database Export
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "api_user" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "password" varchar(128) NOT NULL,
  "last_login" datetime NULL,
  "is_superuser" bool NOT NULL,
  "username" varchar(150) NULL,
  "first_name" varchar(150) NOT NULL,
  "last_name" varchar(150) NOT NULL,
  "is_staff" bool NOT NULL,
  "is_active" bool NOT NULL,
  "date_joined" datetime NOT NULL,
  "email" varchar(254) NOT NULL UNIQUE,
  "name" varchar(255) NOT NULL,
  "role" varchar(50) NOT NULL,
  "avatar" varchar(1000) NOT NULL,
  "company" varchar(255) NOT NULL,
  "phone" varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "api_venue" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "category" varchar(100) NOT NULL,
  "tagline" varchar(500) NOT NULL,
  "city" varchar(100) NOT NULL,
  "state" varchar(100) NOT NULL,
  "address" varchar(500) NOT NULL,
  "rating" real NOT NULL,
  "review_count" integer NOT NULL,
  "price_per_hour" decimal NOT NULL,
  "min_hours" integer NOT NULL,
  "capacity" integer NOT NULL,
  "sqft" integer NOT NULL,
  "featured" bool NOT NULL,
  "badge" varchar(50) NOT NULL,
  "verified" bool NOT NULL,
  "host_name" varchar(255) NOT NULL,
  "host_avatar" varchar(1000) NOT NULL,
  "host_is_superhost" bool NOT NULL,
  "host_response_rate" varchar(50) NOT NULL,
  "host_response_time" varchar(50) NOT NULL,
  "images" text NOT NULL,
  "amenities" text NOT NULL,
  "description" text NOT NULL,
  "rules" text NOT NULL,
  "created_at" datetime NOT NULL
);

CREATE TABLE IF NOT EXISTS "api_event" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" varchar(255) NOT NULL,
  "category" varchar(100) NOT NULL,
  "venue_name" varchar(255) NOT NULL,
  "city" varchar(150) NOT NULL,
  "date" varchar(100) NOT NULL,
  "end_date" varchar(100) NOT NULL DEFAULT '',
  "time" varchar(100) NOT NULL,
  "end_time" varchar(100) NOT NULL DEFAULT '05:00 PM',
  "schedule_type" varchar(50) NOT NULL DEFAULT 'Single Day',
  "status" varchar(50) NOT NULL DEFAULT 'Published',
  "schedule_slots" text NOT NULL,
  "price" decimal NOT NULL,
  "capacity" integer NOT NULL,
  "attendees" integer NOT NULL,
  "badge" varchar(50) NOT NULL,
  "image" varchar(1000) NOT NULL,
  "description" text NOT NULL,
  "created_at" datetime NOT NULL,
  "venue_id" bigint NULL REFERENCES "api_venue" ("id"),
  "organizer_id" bigint NULL REFERENCES "api_user" ("id")
);

CREATE TABLE IF NOT EXISTS "api_tickettier" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "tier_name" varchar(100) NOT NULL,
  "price" decimal NOT NULL,
  "total_quantity" integer NOT NULL,
  "sold_quantity" integer NOT NULL,
  "reserved_quantity" integer NOT NULL,
  "perks" text NOT NULL,
  "status" varchar(50) NOT NULL,
  "max_per_order" integer NOT NULL,
  "created_at" datetime NOT NULL,
  "event_id" bigint NOT NULL REFERENCES "api_event" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "api_booking" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "booking_id" varchar(100) NOT NULL UNIQUE,
  "ticket_code" varchar(100) NOT NULL DEFAULT '',
  "venue_name" varchar(255) NOT NULL,
  "venue_city" varchar(255) NOT NULL,
  "venue_image" varchar(1000) NOT NULL DEFAULT '',
  "date" varchar(50) NOT NULL,
  "startTime" varchar(50) NOT NULL DEFAULT '14:00',
  "duration_hours" integer NOT NULL DEFAULT 4,
  "guests" integer NOT NULL DEFAULT 50,
  "ticket_quantity" integer NOT NULL DEFAULT 1,
  "seats_list" text NOT NULL,
  "event_type" varchar(255) NOT NULL DEFAULT 'Private Event',
  "base_rate" decimal NOT NULL DEFAULT 0,
  "add_ons" text NOT NULL,
  "total_amount" decimal NOT NULL DEFAULT 0,
  "payment_status" varchar(50) NOT NULL DEFAULT 'Paid',
  "status" varchar(50) NOT NULL DEFAULT 'Confirmed',
  "host_name" varchar(255) NOT NULL DEFAULT '',
  "qr_payload" text NOT NULL,
  "created_at" datetime NOT NULL,
  "user_id" bigint NULL REFERENCES "api_user" ("id"),
  "venue_id" bigint NULL REFERENCES "api_venue" ("id"),
  "event_id" bigint NULL REFERENCES "api_event" ("id"),
  "ticket_tier_id" bigint NULL REFERENCES "api_tickettier" ("id")
);

CREATE TABLE IF NOT EXISTS "api_seat" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "section" varchar(100) NOT NULL,
  "row" varchar(10) NOT NULL,
  "seat_number" integer NOT NULL,
  "seat_code" varchar(50) NOT NULL,
  "price" decimal NOT NULL DEFAULT 0,
  "status" varchar(20) NOT NULL DEFAULT 'available',
  "allocated_at" datetime NULL,
  "event_id" bigint NOT NULL REFERENCES "api_event" ("id") ON DELETE CASCADE,
  "tier_id" bigint NULL REFERENCES "api_tickettier" ("id"),
  "allocated_to_id" bigint NULL REFERENCES "api_user" ("id"),
  "booking_id" bigint NULL REFERENCES "api_booking" ("id")
);

COMMIT;