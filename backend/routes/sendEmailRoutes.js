const express = require("express");
const router = express.Router();
const sendEmailAPI = require("../controllers/sendEmailControllers");

router.post("/", async (req, res) => {
    const { email, subject, html } = req.body;
    try {
        const result = await sendEmailAPI.sendEmail({ email, subject, html });
        res.status(200).json({ message: "Email sent successfully", result });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
