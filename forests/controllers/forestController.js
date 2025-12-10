// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const Validation = require("../lib/validation");

const adapter = new PrismaLibSql({
    url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = class ForestController {
    /**
     * Stuurt een lijst van forests terug
     * @param {Request} req 
     * @param {Response} res
     */
    static async getForests  (req, res) {
        const data = await prisma.foodForest.findMany({
            where: {
                deletedAt: null
            }
        });
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
     */
    static async getForest (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const data = await prisma.foodForest.findUnique({ 
            where: {
                id,
                deletedAt: null
            },
            include: {
                plants: {
                    include: {
                        conditions: {
                            orderBy: {
                                createdAt: "desc"
                            }
                        }
                    },
                    where: {
                        deletedAt: null
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
     */
    static async createForest (req, res) {
        const data = Validation.body(req.body, ["ownerId"], ["name", "location", "image"]);
        //TODO: Deze valideren (dat de owner ook echt bestaat)
        data.ownerId = Validation.int(data.ownerId, "ownerId");
        const forest = await prisma.foodForest.create({
            data
        });

        res.status(201).send(`forest created with id ${forest.id}`);
    };

    /**
     * Werkt een forest bij
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateForest (req, res) {
        const data = Validation.body(req.body, ["ownerId", "name", "location", "image"]);
        //TODO: Deze valideren (dat de owner ook echt bestaat)
        data.ownerId = Validation.int(data.ownerId, "ownerId");
        const id = Validation.int(req.params.id, "id", true);
        const forest = await prisma.foodForest.findUnique({where: {id, deletedAt: null}});
        if(!forest){
            throw {status: 404, message: "forest not found"};
        }
        const updated = await prisma.foodForest.update({
            where: {id},
            data
        });

        res.status(200).send(`forest with id ${updated.id} updated`);
    };

    /**
     * Verwijdert een forest
     * @param {Request} req 
     * @param {Response} res 
     */
    static async deleteForest (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const forest = await prisma.foodForest.findUnique({where: {id, deletedAt: null}});
        if(!forest){
            throw {status: 404, message: "forest not found"};
        }
        const result = await prisma.foodForest.update({where: {id}, data: {
            deletedAt: new Date()
        }});
        res.status(200).send(`forest with id ${result.id} deleted`);

    }

    /**
     * Vraagt alle species in een forest op
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getFoodForestSpecies (req, res) {
        const foodForestId = Validation.int(req.params.id, "id", true);
        const forest = await prisma.foodForest.findUnique({where: {id:foodForestId, deletedAt: null}});
        if(!forest){
            throw {status: 404, message: "forest not found"};
        }
        
        const data = await prisma.foodForest.findUnique({
            where: {
                id: foodForestId, deletedAt: null
            },
            select: {
                plants: {
                    select: {
                        species: true
                    }
                }
            }
        });
        const species = data.plants.map((v)=>{
            return v.species
        });


        const response = {
            data:species,
            meta: {
                url: req.originalUrl,
                count: data.length
            }
        }
        res.status(200).json(response);
    }
}