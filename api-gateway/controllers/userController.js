// Standaard dingen
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");
const Validation = require("../lib/validation");
const jwt = require('jsonwebtoken');

const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    port: process.env.DATABASE_PORT,
});

const prisma = new PrismaClient({adapter}); 

module.exports = class UserController {
    static async login(req, res){
        const { email, password } = Validation.body(req.body, [], ["email", "password"]);
        const user = await prisma.user.findUnique({
            where: {
                email, 
                deletedAt: null
            }
        });
        if(user && bcrypt.compareSync(password, user.password)){
            const token = jwt.sign(Validation.body(user, ["id", "role", "email", "displayName"]), process.env.SECRET_KEY, {expiresIn: "7d"});
            const response = {
                data: {
                    token
                },
                meta: {
                    url: req.originalUrl
                }
            };
            res.status(200).json(response);
        } else {
            throw {status: 400, message: "Invalid credentials"};
        }
    }

    static async refreshToken(req, res){
        const user = await prisma.user.findUnique({where: {id: req.jwt.id, deletedAt: null}});
        const token = jwt.sign(Validation.body(user, ["id", "role", "email", "displayName"]), process.env.SECRET_KEY, {expiresIn: "7d"});
        if(user){
            const response = {
                data: {
                    token
                },
                meta: {
                    url: req.originalUrl
                }
            };
            res.status(200).json(response);
        }
        else {
            throw {status: 400, message: "User does not exist"};
        }
    }

    static async createUser(req, res){
        const { password, ...data } = Validation.body(req.body, ["displayName"], ["email", "password"]);
        if(req.jwt?.role === "admin"){
            const { role } = Validation.body(req.body, ["role"]);
            data.role = role;
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email, 
                deletedAt: null
            }
        });
        if(existingUser){
            throw {status: 400, message: "A user with this e-mail already exists"};
        }

        if(password.length < 6){
            throw {status: 400, message: "Password too short"};
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            }
        });
        res.status(201).json({
            message: `User ${user.id} created successfully`,
            meta: {
                url: req.originalUrl
            }
        });
    }
    
    static async updateUser(req, res){
        let data,  id;
        if(req.params?.id){
            // een admin verandert instellingen van een gebruiker
            id = Validation.int(req.params.id, "id", true);  
            if(req.params.id !== req.jwt.id) {
                data = Validation.body(req.body, ["displayName", "email", "password", "role"]);
            } else {
                data = Validation.body(req.body, ["displayName", "email"]);
            }
        } else {
            //een gebruiker verandert zijn eigen instellingen
            id = Validation.int(req.jwt?.id, "jwt.id", true);
            data = Validation.body(req.body, ["displayName", "email"]);;
        }
        
        const user = await prisma.user.findUnique({where: {id, deletedAt: null }});
        if(!user){
            throw {status: 404, message: "user not found"};
        }


        if(data.password){
            if(data.password.length < 6){
                throw {status: 400, message: "Password too short"};
            }
            data.password = bcrypt.hashSync(data.password, 10);
        }

        const updated = await prisma.user.update({
            where: {id},
            data
        });

        res.status(200).json({
            message: `user with id ${updated.id} updated`,
            meta: {
                url: req.originalUrl
            }
        });
    }

    
    static async updatePassword(req, res){
        //een gebruiker verandert zijn eigen instellingen
        const id = Validation.int(req.jwt?.id, "jwt.id", true);
        const data = Validation.body(req.body, [], ["password", "newPassword"]);;
        
        const user = await prisma.user.findUnique({where: {id, deletedAt: null }});
        if(!user){
            throw {status: 404, message: "user not found"};
        }

        if(bcrypt.compareSync(data.password, user.password)){
            const updated = await prisma.user.update({
                where: {id},
                data: {
                    password: bcrypt.hashSync(data.newPassword, 10)
                }
            });

            res.status(200).json({
                message: `user with id ${updated.id} updated`,
                meta: {
                    url: req.originalUrl
                }
            });
        } else {
            throw {status: 400, message: "Invalid credentials"};
        }
    }
    
    static async deleteUser(req, res){
        let id;
        if(req.params?.id && req.jwt?.role === "admin"){
            // een admin verandert instellingen van een gebruiker
            id = Validation.int(req.params.id, "id", true);

        } else {
            //een gebruiker verandert zijn eigen instellingen
            id = Validation.int(req.jwt?.id, "jwt.id", true);
            
            const data = Validation.body(req.body, [], ["password"]);

            const { password } = await prisma.user.findUnique({where: {id: Validation.int(req.jwt?.id, "jwt.id", true), deletedAt: null }, select: {password: true}});

            if(!bcrypt.compareSync(data.password, password)) {
                throw {status: 400, message: "Invalid credentials"};
            }
        }
        
        const user = await prisma.user.findUnique({where: {id, deletedAt: null }});
        if(!user){
            throw {status: 404, message: "user not found"};
        }

        const result = await prisma.user.update({
            where: {id},
            data: {
                deletedAt: new Date()
            }
        });

        res.status(200).json({
            message: `user with id ${result.id} deleted`,
            meta: {
                url: req.originalUrl
            }
        });
    }
    
    static async getUser(req, res){
        let id;
        if(req.params?.id){
            // een admin kijkt naar instellingen van een gebruiker
            id = Validation.int(req.params.id, "id", true);
        } else {
            //een gebruiker kijkt naar zijn eigen instellingen
            id = Validation.int(req.jwt?.id, "jwt.id", true);
        }
        
        const data = await prisma.user.findUnique({
            where: {id, deletedAt: null },
            select: {
                id: true, 
                email: true, 
                createdAt: true, 
                updatedAt: true, 
                displayName: true, 
                role: true
            }
        });
        if(!data){
            throw {status: 404, message: "user not found"};
        }
        const response = {
            data,
            meta: {
                url: req.originalUrl
            }
        };
        res.status(200).json(response);
    }

    static async getUsers(req, res){
        const data = await prisma.user.findMany({
            where: { deletedAt: null },
            select: {
                id: true, 
                email: true, 
                createdAt: true, 
                updatedAt: true, 
                displayName: true, 
                role: true
            }
        });
        const response = {
            data,
            meta: {
                count: data.length,
                url: req.originalUrl
            }
        };
        res.status(200).json(response);
    }
}