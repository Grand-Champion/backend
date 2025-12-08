const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createPlantFactory, resetPositions } = require('./factories');

const adapter = new PrismaLibSql({
    url: "file:./file.db"
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Start seeding...');

    // Maak nieuwe user
    const user = await prisma.user.create({
        data: {
            email: 'admin@voedselbos.nl',
            password: 'admin123',
        }
    });
    console.log(`✅ Created user: ${user.email}`);

    // Maak nieuwe species
    const appleTree = await prisma.species.create({
        data: {
            name: 'Apple Tree',
            scientificName: 'Malus domestica',
            description: 'A fruit tree that produces apples',
            type: 'Tree',
            harvestSeason: 'Autumn',
            sunRequirement: 'Full sun',
            waterNeeds: 'Medium',
            maintenance: 'Low',
            minTemperature: -15,
            maxTemperature: 30,
            minHumidity: 50,
            maxHumidity: 70,
            minSoilPH: 6.0,
            maxSoilPH: 7.0,
            minSoilMoisture: 40,
            maxSoilMoisture: 70,
            minSunlight: 6,
            maxSunlight: 12,
        }
    });

    const pearTree = await prisma.species.create({
        data: {
            name: 'Pear Tree',
            scientificName: 'Pyrus communis',
            description: 'A fruit tree that produces juicy pears',
            type: 'Tree',
            harvestSeason: 'Autumn',
            sunRequirement: 'Full sun',
            waterNeeds: 'Medium',
            maintenance: 'Low',
            minTemperature: -10,
            maxTemperature: 28,
            minHumidity: 50,
            maxHumidity: 70,
            minSoilPH: 6.0,
            maxSoilPH: 7.5,
            minSoilMoisture: 45,
            maxSoilMoisture: 75,
            minSunlight: 6,
            maxSunlight: 10,
        }
    });

    const strawberry = await prisma.species.create({
        data: {
            name: 'Strawberry',
            scientificName: 'Fragaria × ananassa',
            description: 'A ground cover plant with delicious strawberries',
            type: 'Plant',
            harvestSeason: 'Summer',
            sunRequirement: 'Full sun',
            waterNeeds: 'High',
            maintenance: 'Medium',
            minTemperature: -5,
            maxTemperature: 28,
            minHumidity: 60,
            maxHumidity: 75,
            minSoilPH: 5.5,
            maxSoilPH: 6.5,
            minSoilMoisture: 60,
            maxSoilMoisture: 80,
            minSunlight: 6,
            maxSunlight: 10,
        }
    });

    const raspberry = await prisma.species.create({
        data: {
            name: 'Raspberry',
            scientificName: 'Rubus idaeus',
            description: 'A shrub with sweet red raspberries',
            type: 'Shrub',
            harvestSeason: 'Summer',
            sunRequirement: 'Full sun to partial shade',
            waterNeeds: 'Medium',
            maintenance: 'Medium',
            minTemperature: -10,
            maxTemperature: 30,
            minHumidity: 55,
            maxHumidity: 70,
            minSoilPH: 5.5,
            maxSoilPH: 6.5,
            minSoilMoisture: 50,
            maxSoilMoisture: 70,
            minSunlight: 5,
            maxSunlight: 10,
        }
    });

    const blackberry = await prisma.species.create({
        data: {
            name: 'Blackberry',
            scientificName: 'Rubus fruticosus',
            description: 'A wild shrub with dark blackberries',
            type: 'Shrub',
            harvestSeason: 'Summer',
            sunRequirement: 'Full sun to partial shade',
            waterNeeds: 'Low',
            maintenance: 'Low',
            minTemperature: -15,
            maxTemperature: 35,
            minHumidity: 45,
            maxHumidity: 65,
            minSoilPH: 5.0,
            maxSoilPH: 7.0,
            minSoilMoisture: 30,
            maxSoilMoisture: 60,
            minSunlight: 4,
            maxSunlight: 10,
        }
    });

    const rhubarb = await prisma.species.create({
        data: {
            name: 'Rhubarb',
            scientificName: 'Rheum rhabarbarum',
            description: 'A large plant with edible stalks',
            type: 'Plant',
            harvestSeason: 'Spring',
            sunRequirement: 'Full sun to partial shade',
            waterNeeds: 'High',
            maintenance: 'Low',
            minTemperature: -15,
            maxTemperature: 25,
            minHumidity: 50,
            maxHumidity: 70,
            minSoilPH: 6.0,
            maxSoilPH: 7.0,
            minSoilMoisture: 55,
            maxSoilMoisture: 75,
            minSunlight: 4,
            maxSunlight: 8,
        }
    });

    console.log(`✅ Created 6 species`);

    // Maak nieuwe forests
    const forest = await prisma.foodForest.create({
        data: {
            name: 'Amsterdam Food Forest',
            location: 'Amsterdam North',
            ownerId: user.id,
        }
    });
    console.log(`✅ Created forest: ${forest.name}`);

    // Link species aan forest
    await prisma.foodForestSpecies.createMany({
        data: [
            { foodForestId: forest.id, speciesId: appleTree.id },
            { foodForestId: forest.id, speciesId: pearTree.id },
            { foodForestId: forest.id, speciesId: strawberry.id },
            { foodForestId: forest.id, speciesId: raspberry.id },
            { foodForestId: forest.id, speciesId: blackberry.id },
            { foodForestId: forest.id, speciesId: rhubarb.id },
        ]
    });
    console.log(`✅ Linked species to forest`);

    // Maakt random planten met factories
    console.log(`🌱 Creating plants...`);
    resetPositions();
    const species = [appleTree, pearTree, strawberry, raspberry, blackberry, rhubarb];
    
    for (let i = 0; i < 10; i++) {
        const randomSpecies = species[Math.floor(Math.random() * species.length)];
        await prisma.plant.create({
            data: createPlantFactory(forest.id, randomSpecies.id, randomSpecies)
        });
    }
    
    console.log(`✅ Created 10 plants with unique positions`);
    console.log('🌳 Seeding finished!');
}

// Start de seeder
// .catch stopt de seeding als er een error is
// De .finally stopt de prisma client
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
