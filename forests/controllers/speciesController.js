// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = {};

// species controller code

/**
 * Stuurt een lijst van species terug - helaas is het meervoud van species species, erg jammer, maar dan heet het maar zo
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.getSpeciesMany = async (req, res, next) => {
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
 * @param {function} [next]
 */
module.exports.getSpecies = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const data = await prisma.species.findUnique({ where: {id} });
	if(!data){
		res.status(404).send("species not found");
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
 * Maakt een nieuwe species aan
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.createSpecies = async (req, res, next) => {
	if(!req.body){
		res.status(400).send("no data given")
	}
	const {name, description} = req.body;
	const species = await prisma.species.create({
		data: {name, description}
	});
	if(!species){
		res.status(500).send("species not created");
	}

	res.status(201).send(`species created with id ${species.id}`);
};

/**
 * Werkt een species bij
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.updateSpecies = async (req, res, next) => {
	if(!req.body){
		res.status(400).send("no data given")
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const species = await prisma.species.findUnique({where: {id}});
	if(!species){
		res.status(404).send("species not found");
		return;
	}
	const {name, description} = req.body;
	const updated = await prisma.species.update({
		where: {id},
		data: {name, description}
	});

	if(!updated){
		res.status(500).send("failed to update species");
		return;
	}

	res.status(200).send(`species with id ${updated.id} updated`);
};

/**
 * Verwijdert een species
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} [next]
 */
module.exports.deleteSpecies = async (req, res, next) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const species = await prisma.species.findUnique({where: {id}});
	if(!species){
		res.status(404).send("species not found");
		return;
	}
	const result = await prisma.species.delete({where: {id}});
	res.status(200).send(`species with id ${result.id} deleted`);

}