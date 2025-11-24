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
		res.status(400).send("no valid id given");
		return;
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
		res.status(404).send("forest not found");
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
 * Maakt een nieuwe forest aan
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.createForest = async (req, res, next) => {
	if(!req.body){
		res.status(400).send("no data given")
	}
	const {name, location} = req.body;
	//TODO: Deze valideren
    const ownerId = Number.isInteger(parseInt(req.body.ownerId)) ? parseInt(req.body.ownerId) : undefined;
	const forest = await prisma.foodForest.create({
		data: {name, location, ownerId}
	});
	if(!forest){
		res.status(500).send("forest not created");
	}

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
		res.status(400).send("no data given")
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const forest = await prisma.foodForest.findUnique({where: {id}});
	if(!forest){
		res.status(404).send("forest not found");
		return;
	}
	const {name, location} = req.body;
	//TODO: Deze valideren
    const ownerId = Number.isInteger(parseInt(req.body.ownerId)) ? parseInt(req.body.ownerId) : undefined;
	const updated = await prisma.foodForest.update({
		where: {id},
		data: {name, location, ownerId}
	});

	if(!updated){
		res.status(500).send("failed to update forest");
		return;
	}

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
		res.status(400).send("no valid id given");
		return;
	}
	const forest = await prisma.foodForest.findUnique({where: {id}});
	if(!forest){
		res.status(404).send("forest not found");
		return;
	}
	const result = await prisma.foodForest.delete({where: {id}});
	res.status(200).send(`forest with id ${result.id} deleted`);

}

module.exports.createPlant = async (req, res, next) => {
	const forestId = parseInt(req.params.id);
	if(!Number.isInteger(forestId)){
		res.status(400).send("no valid id given");
		return;
	}
	if(!req.body){
		res.status(400).send("no data given")
	}
	const forest = await prisma.foodForest.findUnique({where: {id: forestId}});
	if(!forest){
		res.status(404).send("forest not found");
		return;
	}

	const {stage, harvestPrediction} = req.body;
	const speciesId = parseInt(req.body.speciesId);
	if(!Number.isInteger(speciesId)){
		res.status(400).send("no valid speciesId given");
		return;
	}

	const species = await prisma.species.findUnique({where: {id: speciesId}});
	if(!species){
		res.status(404).send("species not found");
		return;
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