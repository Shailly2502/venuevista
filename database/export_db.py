"""
VenueVista Database Export Utility
Exports live Django database contents to SQL (MySQL and SQLite compatible) and JSON fixtures.
Includes all 4 modules: Event Creation & Scheduling, Ticket Inventory, Seating Allocation, and Sales Reporting.
"""

import os
import sys
import json
from pathlib import Path

# Set up Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'venuevista.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from api.models import Venue, Event, TicketTier, Seat, Booking, HostInquiry

User = get_user_model()
OUT_DIR = BASE_DIR / 'database'

def escape_sql(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "1" if val else "0"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (list, dict)):
        val = json.dumps(val)
    s = str(val).replace("\\", "\\\\").replace("'", "''")
    return f"'{s}'"

def generate_mysql_dump():
    lines = []
    lines.append("-- =============================================================")
    lines.append("-- VenueVista Complete MySQL Database Dump")
    lines.append("-- Database Name: venuevista_db")
    lines.append("-- Compatible with MySQL 5.7+, 8.0+, MariaDB, and phpMyAdmin")
    lines.append("-- =============================================================")
    lines.append("")
    lines.append("CREATE DATABASE IF NOT EXISTS `venuevista_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    lines.append("USE `venuevista_db`;")
    lines.append("")
    lines.append("SET FOREIGN_KEY_CHECKS = 0;")
    lines.append("DROP TABLE IF EXISTS `api_seat`;")
    lines.append("DROP TABLE IF EXISTS `api_tickettier`;")
    lines.append("DROP TABLE IF EXISTS `api_booking`;")
    lines.append("DROP TABLE IF EXISTS `api_event`;")
    lines.append("DROP TABLE IF EXISTS `api_venue`;")
    lines.append("DROP TABLE IF EXISTS `api_hostinquiry`;")
    lines.append("DROP TABLE IF EXISTS `api_user_user_permissions`;")
    lines.append("DROP TABLE IF EXISTS `api_user_groups`;")
    lines.append("DROP TABLE IF EXISTS `api_user`;")
    lines.append("SET FOREIGN_KEY_CHECKS = 1;")
    lines.append("")

    # 1. User table
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_user`")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL DEFAULT '0',
  `username` varchar(150) DEFAULT NULL,
  `first_name` varchar(150) NOT NULL DEFAULT '',
  `last_name` varchar(150) NOT NULL DEFAULT '',
  `is_staff` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `date_joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `email` varchar(254) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL DEFAULT '',
  `role` varchar(50) NOT NULL DEFAULT 'Event Organizer',
  `avatar` varchar(1000) NOT NULL DEFAULT '',
  `company` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 2. Venue table
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_venue`")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_venue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `category` varchar(100) NOT NULL,
  `tagline` varchar(500) NOT NULL DEFAULT '',
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `address` varchar(500) NOT NULL,
  `rating` double NOT NULL DEFAULT '5.0',
  `review_count` int NOT NULL DEFAULT '0',
  `price_per_hour` decimal(12,2) NOT NULL,
  `min_hours` int NOT NULL DEFAULT '1',
  `capacity` int NOT NULL DEFAULT '50',
  `sqft` int NOT NULL DEFAULT '1000',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `badge` varchar(50) NOT NULL DEFAULT '',
  `verified` tinyint(1) NOT NULL DEFAULT '1',
  `host_name` varchar(255) NOT NULL DEFAULT '',
  `host_avatar` varchar(1000) NOT NULL DEFAULT '',
  `host_is_superhost` tinyint(1) NOT NULL DEFAULT '1',
  `host_response_rate` varchar(50) NOT NULL DEFAULT '100%',
  `host_response_time` varchar(50) NOT NULL DEFAULT 'within an hour',
  `images` json NOT NULL,
  `amenities` json NOT NULL,
  `description` longtext NOT NULL,
  `rules` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 3. Event table (Module 1)
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_event` (Module 1: Event Creation & Scheduling)")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_event` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  `city` varchar(150) NOT NULL,
  `date` varchar(100) NOT NULL,
  `end_date` varchar(100) NOT NULL DEFAULT '',
  `time` varchar(100) NOT NULL,
  `end_time` varchar(100) NOT NULL DEFAULT '05:00 PM',
  `schedule_type` varchar(50) NOT NULL DEFAULT 'Single Day',
  `status` varchar(50) NOT NULL DEFAULT 'Published',
  `schedule_slots` json NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `capacity` int NOT NULL DEFAULT '100',
  `attendees` int NOT NULL DEFAULT '0',
  `badge` varchar(50) NOT NULL DEFAULT '',
  `image` varchar(1000) NOT NULL,
  `description` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `venue_id` bigint DEFAULT NULL,
  `organizer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_event_venue_id_idx` (`venue_id`),
  KEY `api_event_organizer_id_idx` (`organizer_id`),
  CONSTRAINT `api_event_venue_id_fk` FOREIGN KEY (`venue_id`) REFERENCES `api_venue` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_event_organizer_id_fk` FOREIGN KEY (`organizer_id`) REFERENCES `api_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 4. TicketTier table (Module 2)
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_tickettier` (Module 2: Ticket Inventory Management)")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_tickettier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_id` bigint NOT NULL,
  `tier_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_quantity` int NOT NULL DEFAULT '100',
  `sold_quantity` int NOT NULL DEFAULT '0',
  `reserved_quantity` int NOT NULL DEFAULT '0',
  `perks` json NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `max_per_order` int NOT NULL DEFAULT '10',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `api_tickettier_event_id_idx` (`event_id`),
  CONSTRAINT `api_tickettier_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `api_event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 5. Booking table (Module 4)
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_booking` (Module 4: Sales Reporting & Analytics)")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` varchar(100) NOT NULL UNIQUE,
  `ticket_code` varchar(100) NOT NULL DEFAULT '',
  `venue_name` varchar(255) NOT NULL,
  `venue_city` varchar(255) NOT NULL,
  `venue_image` varchar(1000) NOT NULL DEFAULT '',
  `date` varchar(50) NOT NULL,
  `startTime` varchar(50) NOT NULL DEFAULT '14:00',
  `duration_hours` int NOT NULL DEFAULT '4',
  `guests` int NOT NULL DEFAULT '50',
  `ticket_quantity` int NOT NULL DEFAULT '1',
  `seats_list` json NOT NULL,
  `event_type` varchar(255) NOT NULL DEFAULT 'Private Event',
  `base_rate` decimal(12,2) NOT NULL DEFAULT '0.00',
  `add_ons` json NOT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `payment_status` varchar(50) NOT NULL DEFAULT 'Paid',
  `status` varchar(50) NOT NULL DEFAULT 'Confirmed',
  `host_name` varchar(255) NOT NULL DEFAULT '',
  `qr_payload` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `user_id` bigint DEFAULT NULL,
  `venue_id` bigint DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  `ticket_tier_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_booking_user_id_idx` (`user_id`),
  KEY `api_booking_venue_id_idx` (`venue_id`),
  KEY `api_booking_event_id_idx` (`event_id`),
  KEY `api_booking_ticket_tier_id_idx` (`ticket_tier_id`),
  CONSTRAINT `api_booking_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_booking_venue_id_fk` FOREIGN KEY (`venue_id`) REFERENCES `api_venue` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_booking_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `api_event` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_booking_ticket_tier_id_fk` FOREIGN KEY (`ticket_tier_id`) REFERENCES `api_tickettier` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 6. Seat table (Module 3)
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_seat` (Module 3: Seating Chart & Allocation)")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_seat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_id` bigint NOT NULL,
  `section` varchar(100) NOT NULL,
  `row` varchar(10) NOT NULL,
  `seat_number` int NOT NULL,
  `seat_code` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) NOT NULL DEFAULT 'available',
  `allocated_at` datetime(6) DEFAULT NULL,
  `tier_id` bigint DEFAULT NULL,
  `allocated_to_id` bigint DEFAULT NULL,
  `booking_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_seat_event_section_row_num_uniq` (`event_id`, `section`, `row`, `seat_number`),
  KEY `api_seat_event_id_idx` (`event_id`),
  KEY `api_seat_tier_id_idx` (`tier_id`),
  KEY `api_seat_booking_id_idx` (`booking_id`),
  CONSTRAINT `api_seat_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `api_event` (`id`) ON DELETE CASCADE,
  CONSTRAINT `api_seat_tier_id_fk` FOREIGN KEY (`tier_id`) REFERENCES `api_tickettier` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_seat_allocated_to_fk` FOREIGN KEY (`allocated_to_id`) REFERENCES `api_user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `api_seat_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `api_booking` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # 7. Host Inquiry table
    lines.append("-- -------------------------------------------------------------")
    lines.append("-- Table structure for `api_hostinquiry`")
    lines.append("-- -------------------------------------------------------------")
    lines.append("""CREATE TABLE `api_hostinquiry` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` varchar(500) NOT NULL DEFAULT '',
  `capacity` int NOT NULL DEFAULT '100',
  `hourly_rate` decimal(12,2) NOT NULL DEFAULT '25000.00',
  `email` varchar(254) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending Review',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;""")
    lines.append("")

    # Data Inserts
    lines.append("-- =============================================================")
    lines.append("-- Data Inserts (Pre-seeded Frontend Credentials & Mock Data)")
    lines.append("-- =============================================================")
    lines.append("")

    # Users
    lines.append("-- Users")
    for u in User.objects.all().order_by('id'):
        lines.append(f"INSERT INTO `api_user` (`id`, `password`, `is_superuser`, `username`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`, `email`, `name`, `role`, `avatar`, `company`, `phone`) VALUES ("
                     f"{u.id}, {escape_sql(u.password)}, {1 if u.is_superuser else 0}, {escape_sql(u.username)}, "
                     f"{escape_sql(u.first_name)}, {escape_sql(u.last_name)}, {1 if u.is_staff else 0}, "
                     f"{1 if u.is_active else 0}, NOW(), {escape_sql(u.email)}, {escape_sql(u.name)}, "
                     f"{escape_sql(u.role)}, {escape_sql(u.avatar)}, {escape_sql(u.company)}, {escape_sql(u.phone)});")
    lines.append("")

    # Venues
    lines.append("-- Venues")
    for v in Venue.objects.all().order_by('id'):
        lines.append(f"INSERT INTO `api_venue` (`id`, `name`, `slug`, `category`, `tagline`, `city`, `state`, `address`, `rating`, `review_count`, `price_per_hour`, `min_hours`, `capacity`, `sqft`, `featured`, `badge`, `verified`, `host_name`, `host_avatar`, `host_is_superhost`, `host_response_rate`, `host_response_time`, `images`, `amenities`, `description`, `rules`, `created_at`) VALUES ("
                     f"{v.id}, {escape_sql(v.name)}, {escape_sql(v.slug)}, {escape_sql(v.category)}, {escape_sql(v.tagline)}, "
                     f"{escape_sql(v.city)}, {escape_sql(v.state)}, {escape_sql(v.address)}, {v.rating}, {v.review_count}, "
                     f"{v.price_per_hour}, {v.min_hours}, {v.capacity}, {v.sqft}, {1 if v.featured else 0}, {escape_sql(v.badge)}, "
                     f"{1 if v.verified else 0}, {escape_sql(v.host_name)}, {escape_sql(v.host_avatar)}, {1 if v.host_is_superhost else 0}, "
                     f"{escape_sql(v.host_response_rate)}, {escape_sql(v.host_response_time)}, {escape_sql(v.images)}, {escape_sql(v.amenities)}, "
                     f"{escape_sql(v.description)}, {escape_sql(v.rules)}, NOW());")
    lines.append("")

    # Events
    lines.append("-- Events (Module 1)")
    for e in Event.objects.all().order_by('id'):
        lines.append(f"INSERT INTO `api_event` (`id`, `title`, `category`, `venue_name`, `city`, `date`, `end_date`, `time`, `end_time`, `schedule_type`, `status`, `schedule_slots`, `price`, `capacity`, `attendees`, `badge`, `image`, `description`, `created_at`, `venue_id`, `organizer_id`) VALUES ("
                     f"{e.id}, {escape_sql(e.title)}, {escape_sql(e.category)}, {escape_sql(e.venue_name)}, {escape_sql(e.city)}, "
                     f"{escape_sql(e.date)}, {escape_sql(e.end_date)}, {escape_sql(e.time)}, {escape_sql(e.end_time)}, {escape_sql(e.schedule_type)}, {escape_sql(e.status)}, {escape_sql(e.schedule_slots)}, {e.price}, {e.capacity}, {e.attendees}, {escape_sql(e.badge)}, "
                     f"{escape_sql(e.image)}, {escape_sql(e.description)}, NOW(), {e.venue_id if e.venue_id else 'NULL'}, {e.organizer_id if e.organizer_id else 'NULL'});")
    lines.append("")

    # Ticket Tiers
    lines.append("-- Ticket Tiers (Module 2)")
    for t in TicketTier.objects.all().order_by('id'):
        lines.append(f"INSERT INTO `api_tickettier` (`id`, `event_id`, `tier_name`, `price`, `total_quantity`, `sold_quantity`, `reserved_quantity`, `perks`, `status`, `max_per_order`, `created_at`) VALUES ("
                     f"{t.id}, {t.event_id}, {escape_sql(t.tier_name)}, {t.price}, {t.total_quantity}, {t.sold_quantity}, {t.reserved_quantity}, {escape_sql(t.perks)}, {escape_sql(t.status)}, {t.max_per_order}, NOW());")
    lines.append("")

    # Bookings
    lines.append("-- Bookings (Module 4)")
    for b in Booking.objects.all().order_by('id'):
        lines.append(f"INSERT INTO `api_booking` (`id`, `booking_id`, `ticket_code`, `venue_name`, `venue_city`, `venue_image`, `date`, `startTime`, `duration_hours`, `guests`, `ticket_quantity`, `seats_list`, `event_type`, `base_rate`, `add_ons`, `total_amount`, `payment_status`, `status`, `host_name`, `qr_payload`, `created_at`, `user_id`, `venue_id`, `event_id`, `ticket_tier_id`) VALUES ("
                     f"{b.id}, {escape_sql(b.booking_id)}, {escape_sql(b.ticket_code)}, {escape_sql(b.venue_name)}, "
                     f"{escape_sql(b.venue_city)}, {escape_sql(b.venue_image)}, {escape_sql(b.date)}, {escape_sql(b.startTime)}, "
                     f"{b.duration_hours}, {b.guests}, {b.ticket_quantity}, {escape_sql(b.seats_list)}, {escape_sql(b.event_type)}, {b.base_rate}, {escape_sql(b.add_ons)}, "
                     f"{b.total_amount}, {escape_sql(b.payment_status)}, {escape_sql(b.status)}, {escape_sql(b.host_name)}, {escape_sql(b.qr_payload)}, "
                     f"NOW(), {b.user_id if b.user_id else 'NULL'}, {b.venue_id if b.venue_id else 'NULL'}, {b.event_id if b.event_id else 'NULL'}, {b.ticket_tier_id if b.ticket_tier_id else 'NULL'});")
    lines.append("")

    # Seats
    lines.append("-- Seats (Module 3)")
    for s in Seat.objects.all().order_by('id')[:100]:
        lines.append(f"INSERT INTO `api_seat` (`id`, `event_id`, `section`, `row`, `seat_number`, `seat_code`, `price`, `status`, `tier_id`, `allocated_to_id`, `booking_id`, `allocated_at`) VALUES ("
                     f"{s.id}, {s.event_id}, {escape_sql(s.section)}, {escape_sql(s.row)}, {s.seat_number}, {escape_sql(s.seat_code)}, {s.price}, {escape_sql(s.status)}, "
                     f"{s.tier_id if s.tier_id else 'NULL'}, {s.allocated_to_id if s.allocated_to_id else 'NULL'}, {s.booking_id if s.booking_id else 'NULL'}, "
                     f"{escape_sql(s.allocated_at.strftime('%Y-%m-%d %H:%M:%S')) if s.allocated_at else 'NULL'});")
    lines.append("")

    return "\n".join(lines)


def generate_sqlite_dump():
    lines = []
    lines.append("-- VenueVista SQLite Database Export")
    lines.append("PRAGMA foreign_keys=OFF;")
    lines.append("BEGIN TRANSACTION;")
    lines.append("")
    # Table schemas
    lines.append("""CREATE TABLE IF NOT EXISTS "api_user" (
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
);""")
    lines.append("")

    lines.append("""CREATE TABLE IF NOT EXISTS "api_venue" (
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
);""")
    lines.append("")

    lines.append("""CREATE TABLE IF NOT EXISTS "api_event" (
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
);""")
    lines.append("")

    lines.append("""CREATE TABLE IF NOT EXISTS "api_tickettier" (
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
);""")
    lines.append("")

    lines.append("""CREATE TABLE IF NOT EXISTS "api_booking" (
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
);""")
    lines.append("")

    lines.append("""CREATE TABLE IF NOT EXISTS "api_seat" (
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
);""")
    lines.append("")

    lines.append("COMMIT;")
    return "\n".join(lines)


if __name__ == '__main__':
    print("Generating database exports in:", OUT_DIR)
    
    # 1. MySQL Dump
    mysql_path = OUT_DIR / 'venuevista_mysql_dump.sql'
    with open(mysql_path, 'w', encoding='utf-8') as f:
        f.write(generate_mysql_dump())
    print(f"[OK] Generated {mysql_path.name}")

    # 2. SQLite Dump
    sqlite_path = OUT_DIR / 'venuevista_sqlite.sql'
    with open(sqlite_path, 'w', encoding='utf-8') as f:
        f.write(generate_sqlite_dump())
    print(f"[OK] Generated {sqlite_path.name}")

    # 3. Schema-only file (schema.sql)
    schema_path = OUT_DIR / 'schema.sql'
    with open(schema_path, 'w', encoding='utf-8') as f:
        full_sql = generate_mysql_dump()
        schema_part = full_sql.split("-- Data Inserts")[0]
        f.write(schema_part)
    print(f"[OK] Generated {schema_path.name}")

    # 4. Seed-only file (seed_data.sql)
    seed_path = OUT_DIR / 'seed_data.sql'
    with open(seed_path, 'w', encoding='utf-8') as f:
        full_sql = generate_mysql_dump()
        seed_part = "-- =============================================================\n" + \
                    "-- VenueVista Seed Data Inserts\n" + \
                    "-- =============================================================\n\n" + \
                    "USE `venuevista_db`;\n\n" + \
                    full_sql.split("-- Data Inserts (Pre-seeded Frontend Credentials & Mock Data)")[1]
        f.write(seed_part)
    print(f"[OK] Generated {seed_path.name}")

    print("All database export files successfully updated across all 4 modules!")
