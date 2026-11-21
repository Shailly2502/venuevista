-- =============================================================
-- VenueVista Complete MySQL Database Dump
-- Database Name: venuevista_db
-- Compatible with MySQL 5.7+, 8.0+, MariaDB, and phpMyAdmin
-- =============================================================

CREATE DATABASE IF NOT EXISTS `venuevista_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `venuevista_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `api_seat`;
DROP TABLE IF EXISTS `api_tickettier`;
DROP TABLE IF EXISTS `api_booking`;
DROP TABLE IF EXISTS `api_event`;
DROP TABLE IF EXISTS `api_venue`;
DROP TABLE IF EXISTS `api_hostinquiry`;
DROP TABLE IF EXISTS `api_user_user_permissions`;
DROP TABLE IF EXISTS `api_user_groups`;
DROP TABLE IF EXISTS `api_user`;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------
-- Table structure for `api_user`
-- -------------------------------------------------------------
CREATE TABLE `api_user` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_venue`
-- -------------------------------------------------------------
CREATE TABLE `api_venue` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_event` (Module 1: Event Creation & Scheduling)
-- -------------------------------------------------------------
CREATE TABLE `api_event` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_tickettier` (Module 2: Ticket Inventory Management)
-- -------------------------------------------------------------
CREATE TABLE `api_tickettier` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_booking` (Module 4: Sales Reporting & Analytics)
-- -------------------------------------------------------------
CREATE TABLE `api_booking` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_seat` (Module 3: Seating Chart & Allocation)
-- -------------------------------------------------------------
CREATE TABLE `api_seat` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table structure for `api_hostinquiry`
-- -------------------------------------------------------------
CREATE TABLE `api_hostinquiry` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
