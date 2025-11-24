module.exports = (err, req, res, next) =>{
    err.status ??= 500;
    res.status(err.status).json({
        status: err.status,
        message: err.message ?? "Something went wrong",
        stack: err.status < 600 && err.status >= 500 ? err.stack : undefined
    });
};