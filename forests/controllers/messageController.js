// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const { PrismaLibSql } = require('@prisma/adapter-libsql');

const Validation = require("../lib/validation");

const adapter = new PrismaLibSql({
    url: "file:./file.db"
})

const prisma = new PrismaClient({ adapter });

module.exports = class MessageController {
    /**
     * Stuurt een lijst van messages terug
     * @param {Request} req 
     * @param {Response} res
     */
    static async getMessages(req, res) {
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
     * Maakt een nieuwe message aan
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createMessage(req, res) {
        const data = Validation.body(req.body, ["userId", "foodForestId"], ["message", "image"]);
        //TODO: Deze valideren (dat de user ook echt bestaat)
        data.userId = Validation.int(data.userId, "userId");
        //TODO: Deze valideren (dat het voedselbos ook echt bestaat)
        data.foodForestId = Validation.int(data.foodForestId, "foodForestId");
        const message = await prisma.messages.create({
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
    static async updateMessage(req, res) {
        const data = Validation.body(
            req.body,
            ["message", "image"],
            ["userId", "foodForestId", "createdAt"]
        );

        //TODO: Deze valideren (dat de user ook echt bestaat)
        const userId = Validation.int(data.userId, "userId");
        //TODO: Deze valideren (dat het voedselbos ook echt bestaat)
        const foodForestId = Validation.int(data.foodForestId, "foodForestId");
        //TODO: Deze valideren  (of de createdAt goed is)
        const createdAt = new Date(data.createdAt);
        if (isNaN(createdAt.getTime())) {
            const err = new Error("Invalid createdAt");
            err.status = 400;
            throw err;
        }

        const message = await prisma.message.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
            },
        });

        if (!message) {
            const err = new Error("Message not found");
            err.status = 404;
            throw err;
        }

        const updateData = Validation.body(data, ["message", "image"]);
        if (Object.keys(updateData).length === 0) {
            const err = new Error("No fields provided to update");
            err.status = 400;
            throw err;
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
    static async deleteMessage(req, res) {
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

        if (!message || message.deletedAt) {
            const err = new Error("Message not found");
            err.status = 404;
            throw err;
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
