// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const Validation = require("../lib/validation");

const adapter = new PrismaLibSql({
    url: "file:./file.db"
})

const prisma = new PrismaClient({adapter}); 

module.exports = class MessageController {
    /**
     * Stuurt een lijst van messages terug
     * @param {Request} req 
     * @param {Response} res
     */
    static async getMessages  (req, res) {
        const data = await prisma.message.findMany({
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
     * Stuurt een specifieke message terug
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getMessage (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const data = await prisma.message.findUnique({ 
            where: {
                id,
                deletedAt: null
            },
            include: {
                messages: {
                    include: {
                        conditions: true
                    },
                    where: {
                        deletedAt: null
                    }
                }
            }
        });
        if(!data){
            throw {status: 404, message: "Message not found"};
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
    static async createMessage (req, res) {
        const data = Validation.body(req.body, ["userId", "foodForestId"], ["Message", "Image"]);
        //TODO: Deze valideren (dat de owner ook echt bestaat)
        data.userId = Validation.int(data.userId, "userId");
        data.foodForest.Id = Validation.int(data.foodForest.Id, "foodForest.id");
        const message = await prisma.message.create({
            data
        });
        res.status(201).send(`Message created with id ${message.id}`);
    };

    /**
     * Werkt een Message bij
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateMessage (req, res) {
        const data = Validation.body(req.body, ["userId", "foodForestId"], ["Message", "Image"]);
        //TODO: Deze valideren (dat de owner ook echt bestaat)
        data.userId = Validation.int(data.userId, "userId");
        data.foodForest.Id = Validation.int(data.foodForest.Id, "foodForest.id");
        const id = Validation.int(req.params.id, "id", true);
        const message = await prisma.message.findUnique({where: {id, deletedAt: null}});
        if(!message){
            throw {status: 404, message: "message not found"};
        }
        const updated = await prisma.message.update({
            where: {id},
            data
        });

        res.status(200).send(`message with id ${updated.id} updated`);
    };

    /**
     * Verwijdert een message
     * @param {Request} req 
     * @param {Response} res 
     */
    static async deleteMessage (req, res) {
        const id = Validation.int(req.params.id, "id", true);
        const message = await prisma.message.findUnique({where: {id, deletedAt: null}});
        if(!message){
            throw {status: 404, message: "message not found"};
        }
        const result = await prisma.message.update({where: {id}, data: {
            deletedAt: new Date()
        }});
        res.status(200).send(`message with id ${result.id} deleted`);

    }
}