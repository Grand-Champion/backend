// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = {};

// forest controller code

/**
 * Stuurt een lijst van forests terug
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.getForests = async (req, res, next) => {
	const data = await prisma.foodForest.findMany();
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
 * Stuurt een specifieke forest terug
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.getForest = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
	const data = await prisma.foodForest.findUnique({ 
		where: {id},
		include: {
			plants: {
				include: {
					species: true
				}
			}
		}
	});
	if(!data){
        throw {status: 404, message: "forest not found"};
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
 * Maakt een nieuwe forest aan
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.createForest = async (req, res, next) => {
	if(!req.body){
        throw {status: 400, message: "no data given"};
	}
	const {name, location} = req.body;
	//TODO: Deze valideren
    const ownerId = Number.isInteger(parseInt(req.body.ownerId)) ? parseInt(req.body.ownerId) : undefined;
	const forest = await prisma.foodForest.create({
		data: {name, location, ownerId}
	});

	res.status(201).send(`forest created with id ${forest.id}`);
};

/**
 * Werkt een forest bij
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.updateForest = async (req, res, next) => {
	if(!req.body){
        throw {status: 400, message: "no data given"};
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
	const forest = await prisma.foodForest.findUnique({where: {id}});
	if(!forest){
        throw {status: 404, message: "forest not found"};
	}
	const {name, location} = req.body;
	//TODO: Deze valideren
    const ownerId = Number.isInteger(parseInt(req.body.ownerId)) ? parseInt(req.body.ownerId) : undefined;
	const updated = await prisma.foodForest.update({
		where: {id},
		data: {name, location, ownerId}
	});

	res.status(200).send(`forest with id ${updated.id} updated`);
};

/**
 * Verwijdert een forest
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.deleteForest = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
	const forest = await prisma.foodForest.findUnique({where: {id}});
	if(!forest){
        throw {status: 404, message: "forest not found"};
	}
	const result = await prisma.foodForest.delete({where: {id}});
	res.status(200).send(`forest with id ${result.id} deleted`);

}

module.exports.createPlant = async (req, res, next) => {
	const forestId = parseInt(req.params.id);
	if(!Number.isInteger(forestId)){
        throw {status: 400, message: "no valid id given"};
	}
	if(!req.body){
        throw {status: 400, message: "no data given"};
	}
	const forest = await prisma.foodForest.findUnique({where: {id: forestId}});
	if(!forest){
        throw {status: 404, message: "forest not found"};
	}

	const {stage, harvestPrediction} = req.body;
	const speciesId = parseInt(req.body.speciesId);
	if(!Number.isInteger(speciesId)){
        throw {status: 400, message: "no valid speciesId id given"};
	}

	const species = await prisma.species.findUnique({where: {id: speciesId}});
	if(!species){
        throw {status: 404, message: "species not found"};
	}

	const plant = await prisma.plant.create({
		data: {
			foodForest: {
				connect: {id: forestId}
			},
			species: {
				connect: {id: speciesId}
			}, 
			stage, 
			harvestPrediction
		}
	});

	res.status(201).send(`plant created with id ${plant.id}`);
}