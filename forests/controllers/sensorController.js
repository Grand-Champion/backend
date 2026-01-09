const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const Validation = require('../lib/validation');

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: process.env.DATABASE_PORT,
});

const prisma = new PrismaClient({ adapter });

exports.storeSensorData = async (req, res) => {
  const plantId = Validation.int(req.body.plantId, 'plantId', true);
  const temperature = Validation.number(req.body.temperature, 'temperature');
  const humidity = Validation.number(req.body.humidity, 'humidity');
  const soilMoisture = Validation.number(req.body.soilMoisture, 'soilMoisture');
  const sunlight = Validation.number(req.body.sunlight, 'sunlight');

  const condition = await prisma.conditions.create({
    data: {
      plantId,
      temperature,
      humidity,
      soilMoisture,
      sunlight,
    },
  });

  res.json({ success: true, data: condition });
};
