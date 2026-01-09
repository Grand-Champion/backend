
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
    if (conditions.temperature != null && species.minTemperature != null && 
        conditions.temperature < species.minTemperature) {
        outOfRange += 1;
    }
    if (conditions.temperature != null && species.maxTemperature != null && 
        conditions.temperature > species.maxTemperature) {
        outOfRange += 1;
    }

    // Check humidity
    if (conditions.humidity != null && species.minHumidity != null && 
        conditions.humidity < species.minHumidity) {
        outOfRange += 1;
    }
    if (conditions.humidity != null && species.maxHumidity != null && 
        conditions.humidity > species.maxHumidity) {
        outOfRange += 1;
    }

    // Check soilPH
    if (conditions.soilPH != null && species.minSoilPH != null && 
        conditions.soilPH < species.minSoilPH) {
        outOfRange += 1;
    }
    if (conditions.soilPH != null && species.maxSoilPH != null && 
        conditions.soilPH > species.maxSoilPH) {
        outOfRange += 1;
    }

    // Check soilMoisture
    if (conditions.soilMoisture != null && species.minSoilMoisture != null && 
        conditions.soilMoisture < species.minSoilMoisture) {
        outOfRange += 1;
    }
    if (conditions.soilMoisture != null && species.maxSoilMoisture != null && 
        conditions.soilMoisture > species.maxSoilMoisture) {
        outOfRange += 1;
    }

    // Check sunlight
    if (conditions.sunlight != null && species.minSunlight != null && 
        conditions.sunlight < species.minSunlight) {
        outOfRange += 1;
    }
    if (conditions.sunlight != null && species.maxSunlight != null && 
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