const WalletService = require('../services/walletService');

class WalletController {
    static async getWalletBalance(req, res, next) {
        try {
            const agentId = req.agent.agentId; 
            const wallet = await WalletService.getAgentWallet(agentId);
            res.status(200).json({ balance: wallet.balance, currency: wallet.currency });
        } catch (error) {
            next(error);
        }
    }

    static async getTransactionHistory(req, res, next) {
        try {
            const agentId = req.agent.agentId; 
            const limit = parseInt(req.query.limit) || 50; 
            const transactions = await WalletService.getAgentTransactions(agentId, limit);
            res.status(200).json({ transactions });
        } catch (error) {
            next(error);
        }
    }

    static async cashIn(req, res, next) {
        const { amount, metadata } = req.body;
        const agentId = req.agent.agentId; 

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Valid positive amount is required for cash-in.' });
        }

        try {
            const transaction = await WalletService.handleCashIn(agentId, amount, metadata);
            res.status(200).json({
                message: 'Cash-in successful.',
                transactionId: transaction.id,
                amount: transaction.amount,
                type: transaction.type,
                status: transaction.status,
                externalTransactionId: transaction.externalTransactionId,
                receipt: transaction.metadata 
            });
        } catch (error) {
            res.status(400).json({ message: error.message }); 
            next(error); 
        }
    }

    static async cashOut(req, res, next) {
        const { amount, metadata } = req.body;
        const agentId = req.agent.agentId; 

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Valid positive amount is required for cash-out.' });
        }

        try {
            const transaction = await WalletService.handleCashOut(agentId, amount, metadata);
            res.status(200).json({
                message: 'Cash-out successful.',
                transactionId: transaction.id,
                amount: transaction.amount,
                type: transaction.type,
                status: transaction.status,
                externalTransactionId: transaction.externalTransactionId,
                receipt: transaction.metadata 
            });
        } catch (error) {
            res.status(400).json({ message: error.message }); 
            next(error); 
        }
    }
}

module.exports = WalletController;