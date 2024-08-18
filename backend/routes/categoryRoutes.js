const express = require("express");
const router = express.Router();
const categoryAPI = require("../controllers/categoryControllers");
router.post("/create_category", categoryAPI.createCategory);
router.get("/get-all", categoryAPI.getCategories);
router.get("/:id", categoryAPI.getCategoryById);
router.put("/update/:id", categoryAPI.updateCategory);
router.delete("/:id", categoryAPI.deleteCategory);

module.exports = router;
