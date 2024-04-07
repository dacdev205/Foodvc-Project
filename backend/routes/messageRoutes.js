const express = require('express');
const router = express.Router();
const messageAPI = require('../controllers/messageControllers');

router.post('/send-message', messageAPI.sendMessage);
router.get('/:conversasionsId', messageAPI.fetchMessageById);
module.exports = router;
