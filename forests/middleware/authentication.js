const jwt = require("jsonwebtoken");

class Authentication {
    /**
     * een middleware om de auth token te verwerken
     * @param {Request} req 
     * @param {Response} res
     * @param {function()} next
     */
    static token(req, res, next){
        const token = req.header('Authorization');
        if (!token) {
            next();
            return;
        }

        let decoded;
        try{
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch {
            throw {status: 400, message: "Token invalid"};
        }
        req.jwt = decoded;
        next();
    }

    /**
     * een middleware om te kijken of iemand ingelogd is
     * @param {Request} req 
     * @param {Response} res
     * @param {function()} next
     */
    static ingelogd(req, res, next){
        if (!req.jwt) {
            throw {status: 401, message: "No token given"};
        }
        next();
    }

    /**
     * Maakt een nieuwe middleware om te kijken of de gebruiker een rol heeft
     * @param {string} role 
     * @returns {function(): void} een middleware
     */
    static metRol(role){
        return function (req, res, next) {
            if(req.jwt.role === role) {
                next();
            } else {
                throw {status: 403, message: "You do not have the permissions to access this route"};
            }
        }
    }
}
module.exports = Authentication;