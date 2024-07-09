const express = require('express');
const { Service } = require('../database');

const router = express.Router();

// Creare serviciu
router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citire servicii
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Citire serviciu după ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizare serviciu
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      await service.update(req.body);
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ștergere serviciu
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      await service.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
