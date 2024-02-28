// Importing necessary libraries and modules
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// Middleware function for verifying admin privileges
const verifyAdmin = async (req, res, next) => {
    // Extracting user's email from the decoded JWT in the request
    const email = req.decoded.email;
    // Constructing a query to find the user in the database based on the extracted email
    const query = { email: email };
    const user = await User.findOne(query);
    // Checking if the user exists and has an 'admin' role
    const isAdmin = user?.role == 'admin';
    // Handling non-admin access
    if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access!" });
    }
    // Passing control to the next middleware in the stack
    next();
};
// Exporting the verifyAdmin middleware for use in other parts of the application
module.exports = verifyAdmin;
