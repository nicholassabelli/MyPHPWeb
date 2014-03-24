-- phpMyAdmin SQL Dump
-- version 3.5.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 02, 2014 at 10:01 PM
-- Server version: 5.5.29
-- PHP Version: 5.4.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ParkingFinder`
--
CREATE DATABASE `ParkingFinder` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ParkingFinder`;

-- --------------------------------------------------------

--
-- Table structure for table `Parking`
--

DROP TABLE IF EXISTS `Parking`;
CREATE TABLE IF NOT EXISTS `Parking` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DESCRIPTION_RPA` varchar(100) NOT NULL,
  `LONGITUDE` decimal(16,14) NOT NULL,
  `LATITUDE` decimal(16,14) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11588 ;
