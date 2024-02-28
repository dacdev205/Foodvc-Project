const { verify } = require("jsonwebtoken");
const paymentAPI = require("../controllers/paymentControllers")
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/",verifyToken,paymentAPI.fetchAllPaymentWithEmail);
router.get("/:id",paymentAPI.fetchPaymentByID);
router.post("/",paymentAPI.createPayment);
router.patch("/:id",paymentAPI.updateProductInPayment);

module.exports = router;
