// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = {};

// plant controller code

/**
 * Werkt een plant bij
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.updatePlant = async (req, res, next) => {
	if(!req.body){
		res.status(400).send("no data given")
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const plant = await prisma.plant.findUnique({where: {id}});
	if(!plant){
		res.status(404).send("plant not found");
		return;
	}
	const {harvestPrediction, stage} = req.body;
	//TODO: Deze valideren
    const speciesId = Number.isInteger(parseInt(req.body.speciesId)) ? parseInt(req.body.speciesId) : undefined;
    const forestId = Number.isInteger(parseInt(req.body.forestId)) ? parseInt(req.body.forestId) : undefined;
	const updated = await prisma.plant.update({
		where: {id},
		data: {harvestPrediction, stage, speciesId, forestId}
	});

	if(!updated){
		res.status(500).send("failed to update plant");
		return;
	}

	res.status(200).send(`plant with id ${updated.id} updated`);
};

/**
 * Stuurt een specifieke plant terug
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.getPlant = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const data = await prisma.plant.findUnique({ 
        where: {id},
        include: {
            species: true,
            conditions: true
        }
     });
	if(!data){
		res.status(404).send("plant not found");
		return
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
module.exports.deletePlant = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const plant = await prisma.plant.findUnique({where: {id}});
	if(!plant){
		res.status(404).send("plant not found");
		return;
	}
    try {
        const result = prisma.conditions.delete({where: {plantId: id}});
    } catch (e) {
        // doe niks, het kan zijn dat er geen conditions zijn voor die plant
        console.warn(e.code);
    }
	const result = prisma.plant.delete({where: {id}});
	res.status(200).send(`plant with id ${plant.id} deleted`);

}