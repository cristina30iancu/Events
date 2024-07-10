const express = require('express');
const { Feedback, Reservation, User, Hall } = require('../database');
const router = express.Router();

// Ruta pentru adăugarea unui feedback
router.post('/', async (req, res) => {
  const { userId, hallId, title, description, rating, reservationId } = req.body;

  try {
    const reservation = await Reservation.findOne({
      where: {
        userId,
        hallId,
        status: 'confirmată'
      }
    });

    if (!reservation) {
      return res.status(400).json({ message: 'Nu aveți o rezervare confirmată pentru acest salon.' });
    }

    const feedback = await Feedback.create({
      userId,
      hallId,
      title,
      description, reservationId,
      rating
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error adding feedback', error: error.message });
  }
});

// Ruta pentru preluarea feedback-urilor unui salon
router.get('', async (req, res) => {
  const query = {};
  const allowedFilters = ['hallId', 'hallId'];
  const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
  if (filterKeys.length > 0) {
      query.where = {};
      for (const key of filterKeys) {
          query.where[key] = {
              [Op.eq]: req.query[key]
          };
      }
  }
  try {
    const feedbacks = await Feedback.findAll({
      where: query.where,
      include: [{ model: User, attributes: ['name'] }, {model: Hall}]
    });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
  }
});

module.exports = router;