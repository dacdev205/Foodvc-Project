const { verify } = require("jsonwebtoken");
const cartAPI = require("../controllers/cartControllers")
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/",verifyToken,cartAPI.fetchAllProductWithEmail);
router.get("/:id",cartAPI.fetchProductInCartByID);
router.post("/",cartAPI.postProductToCart);
router.patch("/:id",cartAPI.updateProductInCart);
router.delete("/:id",cartAPI.deleteProductInCart)

module.exports = router;
