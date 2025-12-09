/**
 * Genereer random nummer
 * @param {number} min - Minimum nummer
 * @param {number} max - Maximum nummer
 * @param {number} decimals - Decimalen
 * @returns {number} Random nummer
 */
function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

/**
 * Pakt random element uit een array
 * @param {Array} array
 * @returns {Array} Random element
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random number
 * @param {number} min - Minimum number
 * @param {number} max - Maximum number
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PLANT_STAGES = ['Young', 'Growing', 'Blooming', 'Mature', 'Fruit-bearing'];
const HEALTH_STATUSES = ['Excellent', 'Good', 'Fair'];
const CONDITION_STATUSES = ['Optimal', 'Good', 'Attention required'];

// zorgt ervoor dat planten niet dezelfde x en y cordinaten krijgen
const usedPositions = new Set();

/**
 * Pakt een x en y die nog niet gebruikt wordt door een andere plant
 * @returns {object} Object met posX and posY
 */
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
        attempts += 1;
    }
    throw new Error('Could not find unique position after 100 attempts');
}

/**
 * Reset positions voor volgende keer dat seeder gerunned wordt
 */
function resetPositions() {
    usedPositions.clear();
}

/**
 * Generate random plant data
 * @param {number} forestId
 * @param {number} speciesId
 * @param {object} species
 * @returns {object} Plant object
 */
function createPlantFactory(forestId, speciesId, species) {
    const hasConditions = Math.random() > 0.2; // 80% kans op conditions (zodat we error meldingen kunnen testen in de frontend)
    const { posX, posY } = getUniquePosition();
    
    // Genereer harvest prediction
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const startMonthIndex = Math.floor(Math.random() * 12);
    const endMonthIndex = (startMonthIndex + 1) % 12;
    let year = 2026;
    if (endMonthIndex < startMonthIndex) {
        year = 2027;
    }
    const harvestPrediction = `${months[startMonthIndex]} - ${months[endMonthIndex]} ${year}`;
    
    // Generate lastInspected datum van 0-30 dagen geleden
    const daysAgo = Math.floor(Math.random() * 31);
    const lastInspected = new Date();
    lastInspected.setDate(lastInspected.getDate() - daysAgo);
    
    // pak random image van plant
    const imageId = randomInt(1, 65535);
    const plantImage = `https://loremflickr.com/640/480/plant?lock=${imageId}`;
    
    let height = `${randomFloat(0.2, 0.6, 2)}m`;
    if (species.type === 'Tree') {
        height = `${randomFloat(1.5, 5.0, 1)}m`;
    } else if (species.type === 'Shrub') {
        height = `${randomFloat(0.5, 2.0, 1)}m`;
    }
    
    const plantData = {
        foodForestId: forestId,
        speciesId,
        stage: randomChoice(PLANT_STAGES),
        plantStage: randomChoice(PLANT_STAGES),
        plantHealth: randomChoice(HEALTH_STATUSES),
        harvestPrediction,
        lastInspected,
        image: plantImage,
        posX,
        posY,
        height,
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