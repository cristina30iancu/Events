const express = require('express');
const { Restaurant, Hall } = require('../database');

const router = express.Router();

// Creare restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citire restaurante
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
});

// Ruta pentru preluarea detaliilor unui restaurant inclusiv saloanele acestuia
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { id: req.params.id },
      include: [Hall]
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant details', error: error.message });
  }
});

// Actualizare restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.update(req.body);
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ștergere restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
