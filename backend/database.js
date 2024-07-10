const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Definire modele
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
  },
});

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
});

const Hall = sequelize.define('Hall', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  facilities: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING,
  },
});

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  perPerson: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numberOfPeople: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('în așteptare', 'confirmată', 'anulată'),
    defaultValue: 'în așteptare',
  },
});

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pdfUrl: {
    type: DataTypes.STRING,
  },
});

const ReservationService = sequelize.define('ReservationService', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ReservationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Reservations',
      key: 'id'
    }
  },
  ServiceId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Services',
      key: 'id'
    }
  }
});

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
});

Reservation.hasOne(Feedback, {foreignKey: 'reservationId'});
Feedback.belongsTo(Reservation, {foreignKey: 'reservationId'})
User.hasMany(Feedback, { foreignKey: 'userId' });
Hall.hasMany(Feedback, { foreignKey: 'hallId' });
Feedback.belongsTo(User, { foreignKey: 'userId' });
Feedback.belongsTo(Hall, { foreignKey: 'hallId' });

// Definire relații
User.hasMany(Reservation, { foreignKey: 'userId' });
Restaurant.hasMany(Hall, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Service, { foreignKey: 'restaurantId' });
Hall.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Hall.hasMany(Reservation, { foreignKey: 'hallId' });
Service.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Service.belongsToMany(Reservation, { through: ReservationService });
Reservation.belongsToMany(Service, { through: ReservationService });
Reservation.belongsTo(User, { foreignKey: 'userId' });
Reservation.belongsTo(Hall, { foreignKey: 'hallId' });
Reservation.hasOne(Invoice, { foreignKey: 'reservationId' });
Invoice.belongsTo(Reservation, { foreignKey: 'reservationId' });

// Sincronizare baza de date
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Unable to sync the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Restaurant,
  Hall,
  Service,
  Reservation,
  Invoice, Feedback,
  syncDatabase, ReservationService
};