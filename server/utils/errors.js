class ServerError extends Error{
    constructor(code, message) {
        super(message);
        this.code = code;
    }
    static badRequest(message){
        let errorMsg = `Bad Request: ${message}`;
        return new ServerError(400, errorMsg);
    }
    static unauthorized(message){
        let errorMsg = `Unauthorized: ${message}`;
        return new ServerError(401, errorMsg);
    }
    static forbidden(message){
        let errorMsg = `Forbidden: ${message}`;
        return new ServerError(403, errorMsg);
    }
    static notFound(message){
        let errorMsg = `NotFound: ${message}`;
        return new ServerError(500, errorMsg);
    }
    static reference(message){
        let errorMsg = `Reference Error: ${message}`;
        return new ServerError(500, errorMsg);
    }
    static etcError(code, message){
        let errorMsg = `Unknown Error: ${message}`;
        return new ServerError(code, errorMsg);
    }
}

const errorHandler = (err, req, res, next) => {
    let data = {};
    if(err instanceof ServerError){
        data.message = err.message;
        res.status(err.code).json(data);
    }
    else{
        data.message = "Undefined Error:" + err.name  + err.message;
        res.status(500).json(data);
    }
}


module.exports = {
    ServerError,
    errorHandler
}