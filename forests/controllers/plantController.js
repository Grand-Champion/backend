// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const Validation = require("../lib/validation");

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = class PlantController {
	/**
	 * Werkt een plant bij
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {function} [next]
	 */
	static async updatePlant (req, res, next) {
		const id = Validation.int(req.params.id, "id", true);
		const data = Validation.body(req.body, ["harvestPrediction", "stage", "speciesId", "forestId"]);
		//TODO: Deze valideren
		data.forestId = Validation.int(data.forestId, "forestId");
		data.speciesId = Validation.int(data.speciesId, "speciesId");

		const plant = await prisma.plant.findUnique({where: {id}});
		if(!plant){
			throw {status: 404, message: "plant not found"};
		}
		const updated = await prisma.plant.update({
			where: {id},
			data
		});

		res.status(200).send(`plant with id ${updated.id} updated`);
	};

	/**
	 * Stuurt een specifieke plant terug
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {function} [next]
	 */
	static async getPlant (req, res, next) {
		const id = Validation.int(req.params.id, "id", true);
		const data = await prisma.plant.findUnique({ 
			where: {id},
			include: {
				species: true,
				conditions: true
			}
		});
		if(!data){
			throw {status: 404, message: "plant not found"};
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
	 * Verwijdert een plant
	 * @param {Request} req 
	 * @param {Response} res 
	 * @param {function} [next]
	 */
	static async deletePlant (req, res, next) {
		const id = Validation.int(req.params.id, "id", true);
		const plant = await prisma.plant.findUnique({where: {id}});
		if(!plant){
			throw {status: 404, message: "plant not found"};
		}
		try {
			const result = await prisma.conditions.delete({where: {plantId: id}});
		} catch (e) {
			if(e.code != "P2025"){
				throw e;
			}
			// doe anders niks, er zijn gewoon geen conditions zijn voor die plant
		}
		const result = await prisma.plant.delete({where: {id}});
		res.status(200).send(`plant with id ${result.id} deleted`);
	}
}