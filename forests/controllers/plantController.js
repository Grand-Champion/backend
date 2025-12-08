// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const Validation = require("../lib/validation");

const adapter = new PrismaLibSql({
    url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = class PlantController {
    /**
     * Werkt een plant bij
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updatePlant (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const data = Validation.body(req.body, ["stage", "harvestPrediction", "height", "image", "speciesId", "posX", "posY"]);
        data.posX = Validation.number(data.posX, "posX", true);
        data.posY = Validation.number(data.posY, "posY", true);
        //TODO: Deze valideren
        data.forestId = Validation.int(data.forestId, "forestId");
        data.speciesId = Validation.int(data.speciesId, "speciesId");

        const plant = await prisma.plant.findUnique({where: {id, deletedAt: null}});
        if(!plant){
            throw {status: 404, message: "plant not found"};
        }
        const updated = await prisma.plant.update({
            where: {id},
            data
        });

        res.status(200).send(`plant with id ${updated.id} updated`);
    };

    /**
     * Stuurt een specifieke plant terug
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getPlant (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const data = await prisma.plant.findUnique({ 
            where: {id, deletedAt: null},
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
     */
    static async deletePlant (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const plant = await prisma.plant.findUnique({where: {id, deletedAt: null}});
        if(!plant){
            throw {status: 404, message: "plant not found"};
        }
        const result = await prisma.plant.update({where: {id}, data: {
            deletedAt: new Date()
        }});
        if(!await prisma.plant.findFirst({where: {foodForestId: result.foodForestId, speciesId: result.speciesId}})){
            prisma.foodForestSpecies.deleteUnique({where: {foodForestId: result.foodForestId, speciesId: result.speciesId}});
        }

        res.status(200).send(`plant with id ${result.id} deleted`);
    }
    
    /**
     * Maakt een plant aan in het bos met de url param "id"
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createPlant (req, res) {
        const forestId = Validation.int(req.params.id, "(forest) id", true);
        Validation.body(req.body, ["stage", "harvestPrediction", "height", "image"], ["speciesId", "posX", "posY"]);
        //de data die we aan prisma doorgeven mag geen speciesId bevatten want dat moet via connect gaan.
        const data = Validation.body(req.body, ["stage", "harvestPrediction", "height", "image", "posX", "posY"]);
        const speciesId = Validation.int(req.body.speciesId, "speciesId", true);
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
                ...data
            }
        });

        await prisma.foodForestSpecies.upsert({
            where: {
                foodForestId_speciesId: {
                    foodForestId: forestId,
                    speciesId
                }
            },
            create:{
                foodForest: {
                    connect: {id: forestId}
                },
                species: {
                    connect: {id: speciesId}
                }
            },
            update: {}
        });

        res.status(201).send(`plant created with id ${plant.id}`);
    }
}