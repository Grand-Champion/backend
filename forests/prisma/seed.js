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

    const blueberry = await prisma.species.create({
        data: {
            name: 'Blueberry',
            scientificName: 'Vaccinium corymbosum',
            description: 'A shrub with sweet blue berries rich in antioxidants',
            type: 'Shrub',
            harvestSeason: 'Summer',
            sunRequirement: 'Full sun',
            waterNeeds: 'Medium',
            maintenance: 'Medium',
            minTemperature: -20,
            maxTemperature: 30,
            minHumidity: 50,
            maxHumidity: 70,
            minSoilPH: 4.5,
            maxSoilPH: 5.5,
            minSoilMoisture: 50,
            maxSoilMoisture: 70,
            minSunlight: 6,
            maxSunlight: 10,
        }
    });

    console.log(`✅ Created 6 species`);

    // Maak meerdere forests
    const forest1 = await prisma.foodForest.create({
        data: {
            name: 'Amsterdam Food Forest',
            location: 'Amsterdam North',
            ownerId: user.id,
        }
    });
    console.log(`✅ Created forest: ${forest1.name}`);

    const forest2 = await prisma.foodForest.create({
        data: {
            name: 'Rotterdam Urban Garden',
            location: 'Rotterdam West',
            ownerId: user.id,
        }
    });
    console.log(`✅ Created forest: ${forest2.name}`);

    const forest3 = await prisma.foodForest.create({
        data: {
            name: 'HZ Green Office',
            location: 'Vlissingen',
            ownerId: user.id,
        }
    });
    console.log(`✅ Created forest: ${forest3.name}`);

    const forests = [forest1, forest2, forest3];
    const allSpecies = [appleTree, pearTree, strawberry, raspberry, blackberry, blueberry];

    // Link species aan beide forests
    for (const forest of forests) {
        await prisma.foodForestSpecies.createMany({
            data: [
                { foodForestId: forest.id, speciesId: appleTree.id },
                { foodForestId: forest.id, speciesId: pearTree.id },
                { foodForestId: forest.id, speciesId: strawberry.id },
                { foodForestId: forest.id, speciesId: raspberry.id },
                { foodForestId: forest.id, speciesId: blackberry.id },
                { foodForestId: forest.id, speciesId: blueberry.id },
            ]
        });
    }
    console.log(`✅ Linked species to all forests`);

    // Maakt random planten voor elke forest
    console.log(`🌱 Creating plants...`);
    
    for (const forest of forests) {
        resetPositions(); // Reset posities voor elke nieuwe forest
        
        for (let i = 0; i < 10; i++) {
            const randomSpecies = allSpecies[Math.floor(Math.random() * allSpecies.length)];
            await prisma.plant.create({
                data: createPlantFactory(forest.id, randomSpecies.id, randomSpecies)
            });
        }
        console.log(`✅ Created 10 plants for ${forest.name}`);
    }
    
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
