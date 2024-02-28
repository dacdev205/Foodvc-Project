const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    // Checking if the request has the 'Authorization' header
    if (!req.headers.authorization) {
        // Responding with a 401 status if the header is missing
        return res.status(401).send({ message: "unauthorized access" });
    }
    // Extracting the token from the 'Authorization' header (Bearer token format)
    const token = req.headers.authorization.split(' ')[1];
    // Verifying the token using the secret key stored in the environment variables
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // Handling cases where the token is invalid
        if (err) {
            return res.status(401).send({ message: "token is invalid!" });
        }
        // Storing the decoded token information in the request for future use
        req.decoded = decoded;
        // Passing control to the next middleware in the stack
        next();
    });
};
module.exports = verifyToken;
