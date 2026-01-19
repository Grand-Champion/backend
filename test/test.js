const assert = require("assert");

//voorbeeld test
describe("#voorbeeld test", ()=>{
    it("2 + 2 is gelijk aan 4", ()=>{
        assert.equal(2 + 2, 4);
    });
});


describe("Status test", ()=>{
    const { calculateConditionStatus } = require("../forests/lib/set-status");

    const testSpecies = {
        minTemperature: -3,
        maxTemperature: 25,
        minHumidity: 20,
        maxHumidity: 80,
        minSoilPH: 5,
        maxSoilPH: 7,
        minSoilMoisture: 10,
        maxSoilMoisture: 60,
        minSunlight: 20,
        maxSunlight: 50
    };

    it("Geen conditions: Unknown", ()=>{
        assert.equal(calculateConditionStatus(null, testSpecies), "Unknown");
    });

    it("Test status: good", ()=>{
        const testConditions = {
            temperature: 12,
            humidity: 40,
            soilPh: 5.6,
            soilMoisture: 30,
            sunlight: 40
        };
        assert.equal(calculateConditionStatus(testConditions, testSpecies), "good");
    });

    it("Test status: attention", ()=>{
        const testConditions = {
            temperature: 12,
            humidity: 40,
            soilPh: 5.6,
            soilMoisture: 30,
            sunlight: 10
        };
        assert.equal(calculateConditionStatus(testConditions, testSpecies), "attention");
    });

    it("Test status: critical", ()=>{
        const testConditions = {
            temperature: -18,
            humidity: 40,
            soilPh: 5.6,
            soilMoisture: 5,
            sunlight: 10
        };
        assert.equal(calculateConditionStatus(testConditions, testSpecies), "critical");
    });
});

describe("Validation test", ()=>{
    const Validation = require("../forests/lib/validation");
    it("int fout", ()=>{
        assert.throws(()=>{
            Validation.int("achttien", "test", true);
        });
    });
    it("int verplicht", ()=>{
        assert.throws(()=>{
            Validation.int(undefined, "test", true);
        });
    });
    it("int niet verplicht", ()=>{
        assert.doesNotThrow(()=>{
            Validation.int(undefined, "test");
        });
        assert.equal(Validation.int(undefined, "test"), undefined);
    });
    it("int correct", ()=>{
        assert.equal(Validation.int("5", "test"), 5);
        assert.equal(Validation.int("5.9", "test"), 5);
    });

    it("number fout", ()=>{
        assert.throws(()=>{
            Validation.number("achttien", "test", true);
        });
    });
    it("number verplicht", ()=>{
        assert.throws(()=>{
            Validation.number(undefined, "test", true);
        });
    });
    it("number niet verplicht", ()=>{
        assert.doesNotThrow(()=>{
            Validation.number(undefined, "test");
        });
        assert.equal(Validation.number(undefined, "test"), undefined);
    });
    it("number correct", ()=>{
        assert.equal(Validation.number("5", "test"), 5);
        assert.equal(Validation.number("5.9", "test"), 5.9);
    });

    it("body geen extra", ()=>{
        assert.deepStrictEqual(Validation.body({katten: 1, honden: 2, vinken: 6}, ["katten"], ["honden"]), {katten: 1, honden: 2});
    });
    it("body verplicht", ()=>{
        assert.throws(()=>{Validation.body({katten: 1}, ["katten"], ["honden"])});
    });
    it("body niet verplicht", ()=>{
        assert.doesNotThrow(()=>{Validation.body({katten: 1}, ["katten", "honden"])});
        assert.deepStrictEqual(Validation.body({katten: 1}, ["katten", "honden"]), {katten: 1});
    });

});