const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/balance', walletController.getWalletBalance); 
router.get('/transactions', walletController.getTransactionHistory); 
router.post('/cash-in', walletController.cashIn); 
router.post('/cash-out', walletController.cashOut); 

module.exports = router;