const User = require('../models/user');
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
    next();
};
module.exports = verifyAdmin;
