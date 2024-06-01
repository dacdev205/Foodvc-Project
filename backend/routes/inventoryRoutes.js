const inventoryAPI = require("../controllers/inventoryControllers");
const router = require("express").Router();
const multer = require("multer");
const express = require("express");
const path = require("path");
//multer middleware
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");

router.post("/", upload, inventoryAPI.createProductInInventory);
router.get("/", inventoryAPI.fetchAllInventory);
router.post("/transfer-to-menu", inventoryAPI.postProductToMenu);
router.post("/remove-from-menu", inventoryAPI.removeProductFromMenu);
router.delete("/:id", inventoryAPI.deleteProductFromInventory);
router.get("/:id", inventoryAPI.fetchProductByID);
router.patch("/:id", upload, inventoryAPI.updateProductInInventory);

module.exports = router;
