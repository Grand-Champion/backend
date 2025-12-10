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
            },
            orderBy: {
                createdAt: "desc",
            },
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
        const userId = Validation.int(req.query.userId, "userId");
        const foodForestId = Validation.int(req.query.foodForestId, "foodForestId");
        const createdAt = new Date(req.query.createdAt);

        const message = await prisma.message.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
        });

        if(!message) {
            return res.status(404).json({ error: "Message not found"});
        }

        res.status(200).json({ message });
    };

    /**
     * Maakt een nieuwe message aan
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createMessage (req, res) {
        const data = Validation.body(req.body, ["userId", "foodForestId"], ["Message", "Image"]);
        //TODO: Deze valideren (dat de user ook echt bestaat)
        data.userId = Validation.int(data.userId, "userId");
        //TODO: Deze valideren (dat het voedselbos ook echt bestaat)
        data.foodForest.Id = Validation.int(data.foodForest.Id, "foodForest.id");
        const message = await prisma.message.create({
            data,
        });
        res.status(201).json({
            message: `Message created successfully`,
            key: {
                userId: message.userId,
                foodForestId: message.foodForestId,
                createdAt: message.createdAt,
            },
        });
    };

    /**
     * Werkt een Message bij
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateMessage (req, res) {
        const data = Validation.body(req.body, ["userId", "foodForestId"], ["Message", "Image"]);
        data.foodForest.Id = Validation.int(data.foodForest.Id, "foodForest.id");
        //TODO: Deze valideren (dat de user ook echt bestaat)
        const userId = Validation.int(req.body.userId, "userId");
        //TODO: Deze valideren (dat het voedselbos ook echt bestaat)
        const foodForestId = Validation.int(req.body.foodForestId, "foodForestId");
        const createdAt = new Date(req.body.createdAt);

        const message = await prisma.message.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
        });

        if(!message){
            return res.status(404).json({ error: "Message not found" });
        }

        const updateData = {};
        if (data.message !== undefined) updateData.message = data.message;
        if (data.image !== undefined) updateData.image = data.image;

        if (Object.keys(updateData.length) === 0) {
            return res.status(400).json({ error: "No fields provided to update"});
        }

        const updated = await prisma.message.update({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
            data: updateData,
        });

        res.status(200).json({
            message: "Message updated successfully",
            key: {
                userId: message.userId,
                foodForestId: message.foodForestId,
                createdAt: message.createdAt,
            },
            data: updated,
        });
    }

    /**
     * Verwijdert een message
     * @param {Request} req 
     * @param {Response} res 
     */
    static async deleteMessage (req, res) {
        const userId = Validation.int(req.params.userId, "userId");
        const foodForestId = Validation.int(req.params.foodForestId, "foodForestId");
        const createdAt = new Date(req.params.createdAt);
        
        const message = await prisma.message.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
        });
        
        if(!message || message.deletedAt) {
            return res.status(404).json({ error: "Message not found"});
        }

        const result = await prisma.message.update({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
            data: {
                deletedAt: new Date()
            } 
        });
        res.status(200).json({
            message: "Message deleted successfully",
            key: {
                userId: result.userId,
                foodForestId: result.foodForestId,
                createdAt: result.createdAt,
            },
        });
    }
}