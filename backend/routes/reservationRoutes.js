const express = require('express');
const { Reservation, Hall, Service, User, ReservationService } = require('../database'); // Asigură-te că importi modelele necesare
const router = express.Router();

// Ruta pentru preluarea tuturor rezervărilor
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: Hall },
        { model: User },
        {
          model: Service,
          through: { model: ReservationService }
        }
      ]
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.findAll({
      where: { userId },
      include: [Hall, Service]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reservations', error: error.message });
  }
});

// Ruta pentru verificarea rezervărilor unui utilizator în anumită zi
router.get('/user/:userId/date/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const reservation = await Reservation.findOne({
      where: {
        userId,
        eventDate: new Date(date)
      }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reservation', error: error.message });
  }
});

// Ruta pentru verificarea rezervărilor unui salon în anumită zi
router.get('/hall/:hallId/date/:date', async (req, res) => {
  try {
    const { hallId, date } = req.params;
    const reservation = await Reservation.findOne({
      where: {
        hallId,
        eventDate: new Date(date)
      }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hall reservation', error: error.message });
  }
});

// Ruta pentru adăugarea unei noi rezervări
router.post('/', async (req, res) => {
  const { eventName, eventDate, numberOfPeople, hallId, serviceIds, userId } = req.body;

  try {
    // Verifică dacă data este din viitor
    if (new Date(eventDate) <= new Date()) {
      return res.status(400).json({ message: 'Data trebuie să fie în viitor.' });
    }

    // Verifică dacă utilizatorul are deja o rezervare în acea zi
    const userReservation = await Reservation.findOne({
      where: {
        userId,
        eventDate: new Date(eventDate)
      }
    });

    if (userReservation) {
      return res.status(400).json({ message: 'Aveți deja o rezervare în acea zi.' });
    }

    // Verifică dacă salonul este deja rezervat în acea zi
    const hallReservation = await Reservation.findOne({
      where: {
        hallId,
        eventDate: new Date(eventDate)
      }
    });

    if (hallReservation) {
      return res.status(400).json({ message: 'Salonul este deja rezervat în acea zi.' });
    }

    // Verifică capacitatea salonului
    const hall = await Hall.findByPk(hallId);
    if (numberOfPeople > hall.capacity) {
      return res.status(400).json({ message: 'Numărul de persoane depășește capacitatea salonului.' });
    }

    // Creează rezervarea și asociază serviciile
    const newReservation = await Reservation.create({
      eventName,
      eventDate,
      numberOfPeople,
      status: 'pending',
      hallId,
      userId
    });

    await newReservation.setServices(serviceIds);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error adding reservation', error: error.message });
  }
});

module.exports = router;
