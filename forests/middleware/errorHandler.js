module.exports = (err, req, res) =>{
    err.status ??= 500;
    if(err.status >= 500 && err.status < 600){
        console.error(message, stack);
    }
    res.status(err.status).json({
        status: err.status,
        message: err.message ?? "Something went wrong",
        stack: err.status < 600 && err.status >= 500 ? err.stack : undefined
    });
};