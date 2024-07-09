const express = require('express');
const { Hall } = require('../database');

const router = express.Router();

// Creare salon
router.post('/', async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json(hall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citire saloane
router.get('/', async (req, res) => {
  try {
    const halls = await Hall.findAll();
    res.status(200).json(halls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citire salon după ID
router.get('/:id', async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (hall) {
      res.status(200).json(hall);
    } else {
      res.status(404).json({ error: 'Hall not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizare salon
router.put('/:id', async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (hall) {
      await hall.update(req.body);
      res.status(200).json(hall);
    } else {
      res.status(404).json({ error: 'Hall not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ștergere salon
router.delete('/:id', async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (hall) {
      await hall.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Hall not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
