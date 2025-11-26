/* eslint-disable no-unused-vars */ 
// express herkent de error handler door de extra 4e parameter
module.exports = (err, req, res, next) =>{
    err.status ??= 500;
    if(err.status >= 500 && err.status < 600){
        console.error(err.message, err.stack);
    }
    res.status(err.status).json({
        status: err.status,
        message: err.message ?? "Something went wrong",
        stack: err.status < 600 && err.status >= 500 ? err.stack : undefined
    });
};