const express = require('express');
const router = express.Router();
const usersAPI = require('../controllers/userControllers')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

router.get("/",verifyToken, verifyAdmin, usersAPI.getAllUsers);
router.post("/", usersAPI.createUser);
router.get("/:id", usersAPI.getSigleUser)
router.delete("/:id",verifyToken, verifyAdmin,usersAPI.deleteUser);
router.get("/getAdmin/:email",verifyToken, usersAPI.getAdmin);
router.patch("/makeAdmin/:id",verifyToken, verifyAdmin,usersAPI.makeAdmin)

module.exports = router;
