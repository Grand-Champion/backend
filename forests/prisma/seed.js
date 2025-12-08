const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
    url: "file:./file.db"
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Start seeding...');

    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            password: 'password123',
        }
    });
    console.log(`✅ Created user with id: ${user.id}`);

    const species = await prisma.species.create({
        data: {
            name: 'Appelboom',
            scientificName: 'Malus domestica',
            description: 'Een fruitboom die appels produceert',
            type: 'Boom',
            harvestSeason: 'Herfst',
            sunRequirement: 'Vol zon',
            waterNeeds: 'Gemiddeld',
            maintenance: 'Laag',
            minTemperature: -15,
            maxTemperature: 30,
        }
    });
    console.log(`✅ Created species with id: ${species.id}`);

    const forest = await prisma.foodForest.create({
        data: {
            name: 'Test Voedselbos',
            location: 'Amsterdam',
            ownerId: user.id,
        }
    });
    console.log(`✅ Created forest with id: ${forest.id}`);

    await prisma.foodForestSpecies.create({
        data: {
            foodForestId: forest.id,
            speciesId: species.id,
        }
    });
    console.log(`✅ Linked species to forest`);

    const plant = await prisma.plant.create({
        data: {
            foodForestId: forest.id,
            speciesId: species.id,
            plantStage: 'Groeiend',
            plantHealth: 'Goed',
            posX: 10.5,
            posY: 20.3,
            conditions: {
                create: {
                    temperature: 22.5,
                    humidity: 65.0,
                    soilPH: 6.5,
                    soilMoisture: 55.0,
                    sunlight: 8.5,
                    status: 'Optimaal'
                }
            }
        }
    });
    console.log(`✅ Created plant with id: ${plant.id} (with conditions)`);

    console.log('🌳 Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
