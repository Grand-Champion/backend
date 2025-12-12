/**
 * Bereken condition status op basis van species min en max conditions
 * @param {object} conditions - Plant conditions
 * @param {object} species - Species met min/max ranges
 * @returns {string} Status: 'good', 'attention', of 'critical'
 */
function calculateConditionStatus(conditions, species) {
    if (!conditions || !species) {
        return 'Unknown';
    }

    let outOfRange = 0;

    // Check temperature
    if (conditions.temperature < species.minTemperature || 
        conditions.temperature > species.maxTemperature) {
        outOfRange += 1;
    }

    // Check humidity
    if (conditions.humidity < species.minHumidity || 
        conditions.humidity > species.maxHumidity) {
        outOfRange += 1;
    }

    // Check soilPH
    if (conditions.soilPH < species.minSoilPH || 
        conditions.soilPH > species.maxSoilPH) {
        outOfRange += 1;
    }

    // Check soilMoisture
    if (conditions.soilMoisture < species.minSoilMoisture || 
        conditions.soilMoisture > species.maxSoilMoisture) {
        outOfRange += 1;
    }

    // Check sunlight
    if (conditions.sunlight < species.minSunlight || 
        conditions.sunlight > species.maxSunlight) {
        outOfRange += 1;
    }

    // Bepaal status op basis van hoeveel conditions buiten de range zijn
    if (outOfRange === 0) {
        return 'good';
    }
    if (outOfRange <= 2) {
        return 'attention';
    }
    return 'critical';
}

module.exports = { calculateConditionStatus };