// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');
const Validation = require('../lib/validation');

const adapter = new PrismaLibSql({
    url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = class SpeciesController {

    /**
	 * Stuurt een lijst van species terug - helaas is het meervoud van species species, erg jammer, maar dan heet het maar zo
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    static async getSpeciesMany (req, res) {
        const data = await prisma.species.findMany();
        const response = {
            data,
            meta: {
                count: data.length,
                url: req.originalUrl
            }
        };
        res.json(response);
    };

    /**
	 * Stuurt een specifieke species terug
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    static async getSpecies (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const data = await prisma.species.findUnique({ where: {id} });
        if(!data){
            throw {status: 404, message: "species not found"};
        }
        const response = {
            data,
            meta: {
                url: req.originalUrl
            }
        };
        res.json(response);
    };

    /**
	 * Maakt een nieuwe species aan
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    static async createSpecies (req, res) {
        const data = Validation.body(
            req.body, 
            [
                "description",
                "category",
                "scientificName",
                "harvestSeason",
                "sunRequirement",
                "waterNeeds",
                "maintenance",
                "plants",
                "minTemperature",
                "maxTemperature",
                "minHumidity",
                "maxHumidity",
                "minSoilPH",
                "maxSoilPH",
                "minSoilMoisture",
                "maxSoilMoisture",
                "minSunlight",
                "maxSunlight"
            ], 
            ["name"]
        );

        const species = await prisma.species.create({
            data
        });

        res.status(201).send(`species created with id ${species.id}`);
    };

    /**
	 * Werkt een species bij
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    static async updateSpecies (req, res) {
        const data = Validation.body(req.body, [
            "description", 
            "name", 
            "category",
            "scientificName",
            "harvestSeason",
            "sunRequirement",
            "waterNeeds",
            "maintenance",
            "plants",
            "minTemperature",
            "maxTemperature",
            "minHumidity",
            "maxHumidity",
            "minSoilPH",
            "maxSoilPH",
            "minSoilMoisture",
            "maxSoilMoisture",
            "minSunlight",
            "maxSunlight"]);
        const id = Validation.int(req.params.id, "id", true);

        const species = await prisma.species.findUnique({where: {id}});
        if(!species){
            throw {status: 404, message: "species not found"};
        }

        const updated = await prisma.species.update({
            where: {id},
            data
        });

        res.status(200).send(`species with id ${updated.id} updated`);
    };

    /**
	 * Verwijdert een species
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    static async deleteSpecies (req, res) {
        const id = Validation.int(req.params.id, "id", true);

        const species = await prisma.species.findUnique({where: {id}});
        if(!species){
            throw {status: 404, message: "species not found"};
        }

        const result = await prisma.species.delete({where: {id}});
        res.status(200).send(`species with id ${result.id} deleted`);
    }
}