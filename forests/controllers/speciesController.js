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
        throw {status: 400, message: "no valid id given"};
	}
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
 * @param {function} [next]
 */
module.exports.createSpecies = async (req, res, next) => {
	if(!req.body){
		throw {status: 400, message: "no data given"};
	}
	const {name, description} = req.body;
	const species = await prisma.species.create({
		data: {name, description}
	});

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
		throw {status: 400, message: "no data given"};
	}
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
        throw {status: 400, message: "no valid id given"};
	}
	const species = await prisma.species.findUnique({where: {id}});
	if(!species){
        throw {status: 404, message: "species not found"};
	}
	const {name, description} = req.body;
	const updated = await prisma.species.update({
		where: {id},
		data: {name, description}
	});

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
        throw {status: 400, message: "no valid id given"};
	}
	const species = await prisma.species.findUnique({where: {id}});
	if(!species){
        throw {status: 404, message: "species not found"};
	}
	const result = await prisma.species.delete({where: {id}});
	res.status(200).send(`species with id ${result.id} deleted`);

}