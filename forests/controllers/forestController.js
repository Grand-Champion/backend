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
	 */
    static async getForest (req, res) {
        const id = Validation.int(req.params.id, "id", true);
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
	 */
    static async createForest (req, res) {
        const data = Validation.body(req.body, ["ownerId"], ["name", "location"]);
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
        const data = Validation.body(req.body, ["ownerId", "name", "location"]);
        //TODO: Deze valideren (dat de owner ook echt bestaat)
        data.ownerId = Validation.int(data.ownerId, "ownerId");
        const id = Validation.int(req.params.id, "id", true);
        const forest = await prisma.foodForest.findUnique({where: {id}});
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
        const forest = await prisma.foodForest.findUnique({where: {id}});
        if(!forest){
            throw {status: 404, message: "forest not found"};
        }
        const result = await prisma.foodForest.delete({where: {id}});
        res.status(200).send(`forest with id ${result.id} deleted`);

    }

    /**
     * Maakt een plant aan in het bos
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createPlant (req, res) {
        const forestId = Validation.int(req.params.id, "(forest) id", true);
        const data = Validation.body(req.body, ["stage", "harvestPrediction", "height", "image"], ["speciesId", "posX", "posY"]);
        data.speciesId = Validation.int(data.speciesId, "speciesId", true);
        data.posX = Validation.number(data.posX, "posX", true);
        data.posY = Validation.number(data.posY, "posY", true);

        const forest = await prisma.foodForest.findUnique({where: {id: forestId}});
        if(!forest){
            throw {status: 404, message: "forest not found"};
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
}