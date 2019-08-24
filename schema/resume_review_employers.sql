-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Aug 24, 2019 at 06:13 AM
-- Server version: 5.6.38
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tribunal`
--

-- --------------------------------------------------------

--
-- Table structure for table `resume_review_employers`
--

CREATE TABLE `resume_review_employers` (
  `id` int(6) UNSIGNED NOT NULL,
  `name` varchar(256) NOT NULL,
  `company` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `diet` tinytext NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `alumnus` varchar(3) NOT NULL,
  `majors` text NOT NULL,
  `sign_up_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `selected_times` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `resume_review_employers`
--
ALTER TABLE `resume_review_employers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resume_review_employers`
--
ALTER TABLE `resume_review_employers`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
