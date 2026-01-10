// Standaard dingen
const { PrismaClient } = require('@prisma/client');

const Validation = require("../lib/validation");

const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    port: process.env.DATABASE_PORT,
});


const prisma = new PrismaClient({ adapter });

module.exports = class MessageController {
    /**
     * Stuurt een lijst van messages terug
     * @param {Request} req 
     * @param {Response} res
     */
    static async getMessages(req, res) {
        const data = await prisma.messages.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true
                            }
                        }
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
     * Maakt een nieuwe message aan
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createMessage(req, res) {
    const userId = Validation.int(req.jwt.id, "jwt.id");

    const foodForestId = Validation.int(req.params.foodForestId, "foodForestId");

    // message data
    const data = Validation.body(req.body, ["message", "image"]);

    // check of forest bestaat
    const forestExists = await prisma.foodForest.findFirst({
        where: {
            id: foodForestId,
            deletedAt: null
        }
    });

    if (!forestExists) {
        throw { status: 404, message: "Food forest not found" };
    }

    const message = await prisma.messages.create({
        data: {
            message: data.message,
            image: data.image,
            user: {
                connect: { id: userId }
            },
            foodForest: {
                connect: { id: foodForestId }
            }
        }
    });

    res.status(201).json({
        message: "Message created successfully",
        data: message
    });
}

    /**
     * Werkt een Message bij
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateMessage(req, res) {
        const data = Validation.body(
            req.body,
            ["message", "image"],
        );

        //TODO: Deze valideren (dat de user ook echt bestaat)
        const userId = Validation.int(req.params.userId, "userId", true);
        //TODO: Deze valideren (dat het voedselbos ook echt bestaat)
        const foodForestId = Validation.int(req.params.foodForestId, "foodForestId", true);
        //TODO: Deze valideren  (of de createdAt goed is)
        
        const createdAt = new Date(Validation.int(req.params.createdAt, "createdAt", true));
        if (isNaN(createdAt.getTime())) {
            const err = new Error("Invalid createdAt");
            err.status = 400;
            throw err;
        }

        const message = await prisma.messages.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
                deletedAt: null
            },
        });

        if (!message) {
            const err = new Error("Message not found");
            err.status = 404;
            throw err;
        }

        if(req.jwt.role === "admin" || Validation.int(req.jwt.id, "jwt.id") === message.userId) {
            const updateData = Validation.body(data, ["message", "image"]);
            if (Object.keys(updateData).length === 0) {
                const err = new Error("No fields provided to update");
                err.status = 400;
                throw err;
            }

            const updated = await prisma.messages.update({
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
        } else {
            throw {status: 403, message: "You are not authorised to do this"};
        }
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

        const message = await prisma.messages.findUnique({
            where: {
                userId_foodForestId_createdAt: {
                    userId,
                    foodForestId,
                    createdAt,
                },
                deletedAt: null
            },
            include: {
                foodForest: true
            }
        });

        if (!message) {
            const err = new Error("Message not found");
            err.status = 404;
            throw err;
        }

        if(req.jwt.role === "admin" || Validation.int(req.jwt.id, "jwt.id") === message.foodForest.ownerId || Validation.int(req.jwt.id, "jwt.id") === message.userId) {
            const result = await prisma.messages.update({
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
        } else {
            throw {status: 403, message: "You are not authorised to do this"};
        }
    } 
}
