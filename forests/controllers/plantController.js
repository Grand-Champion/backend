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

        const plant = await prisma.plant.findUnique({where: {id}});
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
     */
    static async deletePlant (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const plant = await prisma.plant.findUnique({where: {id}});
        if(!plant){
            throw {status: 404, message: "plant not found"};
        }
        try {
            await prisma.conditions.delete({where: {plantId: id}});
        } catch (e) {
            // alleen als het een error P2025 is (we kunnen de conditions niet verwijderen omdat ze niet bestaan) negeren we hem,
            // anders throwen we hem weer zodat de error handler hem oppakt.
            if(e.code !== "P2025"){
                throw e;
            }
        }
        const result = await prisma.plant.delete({where: {id}});
        res.status(200).send(`plant with id ${result.id} deleted`);
    }
    
    /**
     * Maakt een plant aan in het bos met de url param "id"
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