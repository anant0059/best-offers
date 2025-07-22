export async function errorHandler(err, req, res, next) {
    console.log("errorHandler", err.message)
    if (err.name === 'UnauthorizedException') {
        res.status(403).json({ message: err.message });
    } else if (err.name === 'ConflictException') {
        res.status(409).json({ message: err.message });
    } else if (err.message === "Validation failed") {
        const error = {
            message: err.message,
        };
        err.details.forEach(element => {
            error.details = element.details.map(item => {
                return { message: item.message, type: item.type }
            })
        });
        res.status(err.status || 400).json(error);
    } else {
        res.status(500).json({ message: err.message });
    }
}