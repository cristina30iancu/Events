const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./database');

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const hallRoutes = require('./routes/hallRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware pentru parsarea JSON
app.use(express.json());
app.use(cors());
// Rute
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/halls', hallRoutes);
app.use('/services', serviceRoutes);
app.use('/reservations', reservationRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/auth', authRoutes);

// Pornirea serverului și sincronizarea bazei de date
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await syncDatabase();
});
