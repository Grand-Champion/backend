/*const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");*/
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = {};

module.exports.getForests = async (req, res) => {
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


module.exports.getForest = async (req, res) => {
	const id = parseInt(req.params.id);
	if(!Number.isInteger(id)){
		res.status(400).send("no valid id given");
		return;
	}
	const data = await prisma.foodForest.findUnique({ where: {id} });
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

module.exports.createForest = async (req, res) => {
	if(!req.body){
		res.status(400).send("no data given")
	}
	//TODO: Deze valideren
	const {name, location, ownerId} = req.body;
	const forest = await prisma.foodForest.create({
		data: {name, location, ownerId}
	});
	if(!forest){
		res.status(500).send("forest not created");
	}

	res.status(201).send(`forest created with id ${forest.id}`);
};

module.exports.updateForest = async (req, res) => {
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
	//TODO: Deze valideren
	const {name, location, ownerId} = req.body;
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

module.exports.deleteForest = async (req, res) => {
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