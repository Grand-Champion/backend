const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: process.env.DATABASE_PORT,
});

const prisma = new PrismaClient({ adapter });

exports.storeSensorData = async (req, res) => {
  const {
    plantId,
    temperature,
    humidity,
    soilMoisture,
    sunlight,
  } = req.body;

  if (!plantId) {
    return res.status(400).json({ error: 'plantId missing' });
  }

  try {
    const condition = await prisma.conditions.create({
      data: {
        plantId: Number(plantId),
        temperature: temperature ?? null,
        humidity: humidity ?? null,
        soilMoisture: soilMoisture ?? null,
        sunlight: sunlight ?? null,
      },
    });

    console.log("New sensor data saved:", condition);
    res.json({ success: true, data: condition });
  } catch (err) {
    console.error("Database insert is mislukt swa:", err);
    res.status(500).json({ error: 'Database insert failed' });
  }
};
