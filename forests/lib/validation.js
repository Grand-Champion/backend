/**
 * Utility code voor het valideren van dingen
 * vooral om duplicatie v code te verminderen
 */

module.exports = class Validation {
    /**
     * Als het een integer is, dan maakt hij er een nummer van, anders is het undefined of gooit hij een error 400 als er een name is.
     * @param {String} int 
     * @param {String} name 
     * @param {Boolean?} verplicht
     * @returns {Number} 
     */
    static int (int, name, verplicht) {
        if(int === undefined || int === null){
            if(verplicht) {
                throw {status: 400, message: `no ${name} given`};
            }
            return undefined;
        }
        const nint = parseInt(int, 10);
        if(!Number.isInteger(nint)){
            throw {status: 400, message: `no valid ${name} given, must be an integer`};
        }
        return nint;
    }

    
    /**
     * Als het een nummer is, dan maakt hij er een nummer van, anders is het undefined of gooit hij een error 400 als er een name is.
     * @param {String} string 
     * @param {String} name 
     * @param {Boolean?} verplicht
     * @returns {Number} 
     */
    static number(string, name, verplicht) {
        if(string === undefined || string === null){
            if(verplicht) {
                throw {status: 400, message: `no ${name} given`};
            }
            return undefined;
        }
        const number = Number(string);
        if(Number.isNaN(number)){
            throw {status: 400, message: `no valid ${name} given, must be an integer`};
        }
        return number;
    }


    /**
     * Als je een object geeft, kijkt hij of alle verplichte dingen er in zitten (gooit anders een error) en geeft hij een kopie zonder alles wat er niet in hoort terug.
     * @param {Object} body 
     * @param {String[]?} optioneel 
     * @param {String[]?} verplicht 
     * @returns {Object}
     */
    static body (body, optioneel = [], verplicht = []) {
        const data = {};
        if(!body){
            throw {status: 400, message: "no data given"};
        }
        for(const key of verplicht){
            if(!body[key]){
                throw {status: 400, message: `a value for ${key} must be specified`};
            }
            data[key] = body[key];
        }
        for(const key of optioneel){
            if(body[key]){
                data[key] = body[key];
            }
        }
        return data;
    };
}