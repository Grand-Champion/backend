/*const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");*/
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = {};

module.exports.getForests = async (req, res, next) => {
	const foodForests = await prisma.foodForest.findMany();
	res.json(foodForests)
};