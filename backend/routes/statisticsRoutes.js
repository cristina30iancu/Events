const express = require('express');
const { Reservation, Hall, Restaurant } = require('../database');
const router = express.Router();
const { Op } = require('sequelize');

// Endpoint pentru gradul de ocupare per salon
router.get('/hall-occupancy', async (req, res) => {
  try {
    const halls = await Hall.findAll({ include: Reservation });
    const data = halls.map(hall => {
      const occupiedDays = hall.Reservations.length;
      return {
        name: hall.name,
        occupiedDays
      };
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hall occupancy', error: error.message });
  }
});

// Endpoint pentru gradul de ocupare per restaurant
router.get('/restaurant-occupancy', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({ include: { model: Hall, include: Reservation } });
    const data = restaurants.map(restaurant => {
      const occupiedHalls = restaurant.Halls.reduce((count, hall) => count + (hall.Reservations.length > 0 ? 1 : 0), 0);
      return {
        name: restaurant.name,
        occupiedHalls
      };
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant occupancy', error: error.message });
  }
});

// Endpoint pentru gradul de ocupare per lună
router.get('/monthly-occupancy', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    const monthOccupancy = Array(12).fill(0);

    reservations.forEach(reservation => {
      const month = new Date(reservation.eventDate).getMonth();
      monthOccupancy[month]++;
    });

    res.json(monthOccupancy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly occupancy', error: error.message });
  }
});

module.exports = router;
