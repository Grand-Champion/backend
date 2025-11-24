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
		throw {status: 400, message: "no data given"};
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
	const plant = await prisma.plant.findUnique({where: {id}});
	if(!plant){
        throw {status: 404, message: "plant not found"};
	}
	const {harvestPrediction, stage} = req.body;
	//TODO: Deze valideren
    const speciesId = Number.isInteger(parseInt(req.body.speciesId)) ? parseInt(req.body.speciesId) : undefined;
    const forestId = Number.isInteger(parseInt(req.body.forestId)) ? parseInt(req.body.forestId) : undefined;
	const updated = await prisma.plant.update({
		where: {id},
		data: {harvestPrediction, stage, speciesId, forestId}
	});

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
        throw {status: 400, message: "no valid id given"};
	}
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
module.exports.deletePlant = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
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