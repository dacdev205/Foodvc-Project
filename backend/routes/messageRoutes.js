const express = require('express');
const router = express.Router();
const messageAPI = require('../controllers/messageControllers');

router.post('/send-message', messageAPI.sendMessage);
router.get('/', messageAPI.fetchAllMessages)
router.get('/:chatId', messageAPI.fetchMessageById);
module.exports = router;
