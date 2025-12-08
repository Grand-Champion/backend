function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const PLANT_STAGES = ['Young', 'Growing', 'Blooming', 'Mature', 'Fruit-bearing'];
const HEALTH_STATUSES = ['Excellent', 'Good', 'Fair'];
const CONDITION_STATUSES = ['Optimal', 'Good', 'Attention required'];

// zorgt ervoor dat planten niet dezelfde x en y cordinaten krijgen
const usedPositions = new Set();

function getUniquePosition() {
    let attempts = 0;
    while (attempts < 100) {
        const posX = randomFloat(5, 45, 1);
        const posY = randomFloat(5, 45, 1);
        const key = `${posX},${posY}`;
        
        if (!usedPositions.has(key)) {
            usedPositions.add(key);
            return { posX, posY };
        }
        attempts++;
    }
}

function resetPositions() {
    usedPositions.clear();
}

function createPlantFactory(forestId, speciesId, species) {
    const hasConditions = Math.random() > 0.4; // 60% kans op conditions (zodat we error meldingen kunnen testen in de frontend)
    const { posX, posY } = getUniquePosition();
    
    // Genereer harvest prediction datum (1-6 maanden in de toekomst)
    const monthsInFuture = Math.floor(Math.random() * 6) + 1;
    const harvestDate = new Date();
    harvestDate.setMonth(harvestDate.getMonth() + monthsInFuture);
    const harvestPrediction = harvestDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const plantData = {
        foodForestId: forestId,
        speciesId: speciesId,
        plantStage: randomChoice(PLANT_STAGES),
        plantHealth: randomChoice(HEALTH_STATUSES),
        harvestPrediction: harvestPrediction,
        posX,
        posY,
        height: species.type === 'Tree' 
            ? `${randomFloat(1.5, 5.0, 1)}m`
            : species.type === 'Shrub'
            ? `${randomFloat(0.5, 2.0, 1)}m`
            : `${randomFloat(0.2, 0.6, 2)}m`,
    };

    if (hasConditions) {
        plantData.conditions = {
            create: {
                temperature: randomFloat(15, 25, 1),
                humidity: randomFloat(50, 75, 1),
                soilPH: randomFloat(species.minSoilPH || 6.0, species.maxSoilPH || 7.0, 1),
                soilMoisture: randomFloat(species.minSoilMoisture || 50, species.maxSoilMoisture || 70, 1),
                sunlight: randomFloat(species.minSunlight || 6, species.maxSunlight || 10, 1),
                status: randomChoice(CONDITION_STATUSES),
            }
        };
    }

    return plantData;
}

module.exports = { createPlantFactory, resetPositions };
