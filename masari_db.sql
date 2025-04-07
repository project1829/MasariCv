-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 04 أبريل 2025 الساعة 21:40
-- إصدار الخادم: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `masari_db`
--

-- --------------------------------------------------------

--
-- بنية الجدول `cvs`
--

CREATE TABLE `cvs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `language_mode` varchar(20) NOT NULL,
  `layout_style` varchar(50) DEFAULT NULL,
  `color_scheme` varchar(50) DEFAULT NULL,
  `font_style` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `cv_personal_info`
--

CREATE TABLE `cv_personal_info` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `full_name_ar` varchar(255) DEFAULT NULL,
  `job_title_ar` varchar(255) DEFAULT NULL,
  `email_cv` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address_ar` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `degree_ar` varchar(255) DEFAULT NULL,
  `institution_ar` varchar(255) DEFAULT NULL,
  `start_date_edu` varchar(7) DEFAULT NULL,
  `end_date_edu` varchar(7) DEFAULT NULL,
  `present_edu` tinyint(1) DEFAULT 0,
  `description_edu_ar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `experience`
--

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `job_title_exp_ar` varchar(255) DEFAULT NULL,
  `company_name_ar` varchar(255) DEFAULT NULL,
  `company_location_ar` varchar(255) DEFAULT NULL,
  `start_date_exp` varchar(7) DEFAULT NULL,
  `end_date_exp` varchar(7) DEFAULT NULL,
  `present_exp` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `experience_tasks`
--

CREATE TABLE `experience_tasks` (
  `id` int(11) NOT NULL,
  `experience_id` int(11) NOT NULL,
  `task_description_ar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `cv_id` int(11) NOT NULL,
  `skills_text_ar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'raniah', 'raniah@gmail.com', '$2y$10$.E8GEHNQhHanTIf3zMg33elt2ERXEoKFTsttU.7T.M4hN18qb7UFO', '2025-04-04 19:13:02', '2025-04-04 19:13:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cvs`
--
ALTER TABLE `cvs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cv_personal_info`
--
ALTER TABLE `cv_personal_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cv_id` (`cv_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cv_id` (`cv_id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cv_id` (`cv_id`);

--
-- Indexes for table `experience_tasks`
--
ALTER TABLE `experience_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experience_id` (`experience_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cv_id` (`cv_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cvs`
--
ALTER TABLE `cvs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cv_personal_info`
--
ALTER TABLE `cv_personal_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `experience_tasks`
--
ALTER TABLE `experience_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `cvs`
--
ALTER TABLE `cvs`
  ADD CONSTRAINT `cvs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `cv_personal_info`
--
ALTER TABLE `cv_personal_info`
  ADD CONSTRAINT `cv_personal_info_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `experience_tasks`
--
ALTER TABLE `experience_tasks`
  ADD CONSTRAINT `experience_tasks_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experience` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


ALTER TABLE `cv_personal_info`
ADD COLUMN `summary_ar` TEXT DEFAULT NULL COMMENT 'الملخص المهني أو الهدف الوظيفي' AFTER `portfolio_url`;

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cv_id` int(11) NOT NULL,
  `cert_name_ar` varchar(255) NOT NULL COMMENT 'اسم الشهادة أو الدورة',
  `cert_org_ar` varchar(255) DEFAULT NULL COMMENT 'الجهة المانحة',
  `cert_date_ar` varchar(7) DEFAULT NULL COMMENT 'تاريخ الحصول عليها (YYYY-MM أو YYYY)',
  PRIMARY KEY (`id`),
  KEY `cv_id` (`cv_id`),
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`cv_id`) REFERENCES `cvs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='جدول لتخزين الشهادات والدورات';