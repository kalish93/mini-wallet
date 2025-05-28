const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const Alert = require('../models/alert'); 
const MockExternalAPI = require('../mockApi'); 

class WalletService {
    static async getAgentWallet(agentId) {
        try {
           
            const wallet = await Wallet.getByAgentId(agentId);
            if (!wallet) {
                throw new Error('Wallet not found for this agent.');
            }

            
            return wallet;
        } catch (error) {
            console.error('WalletService.getAgentWallet error:', error.message);
            throw error;
        }
    }

    static async getAgentTransactions(agentId, limit = 50) {
        try {
            const transactions = await Transaction.getRecentByAgentId(agentId, limit);
            return transactions;
        } catch (error) {
            console.error('WalletService.getAgentTransactions error:', error.message);
            throw error;
        }
    }

    static async handleCashIn(agentId, amount, metadata = {}) {
        if (amount <= 0) {
            throw new Error('Cash-in amount must be positive.');
        }
        try {
           
            const transaction = await Transaction.handleCashIn(agentId, amount, metadata, MockExternalAPI.call);

            const wallet = await Wallet.getByAgentId(agentId);
            // if (wallet.balance < 200 && wallet.balance >= 0) { // Example threshold
            //     await Alert.create(agentId, 'LOW_BALANCE', `Your wallet balance is critically low: ${wallet.balance}`, 500);
            // }
           


            return transaction;
        } catch (error) {
            console.error('WalletService.handleCashIn error:', error.message);
            throw error;
        }
    }

    static async handleCashOut(agentId, amount, metadata = {}) {
        if (amount <= 0) {
            throw new Error('Cash-out amount must be positive.');
        }
        try {
           
            let transaction;
            const wallet = await Wallet.getByAgentId(agentId);
            if (wallet.balance < 200 && wallet.balance >= 0) { 
                await Alert.create(agentId, 'LOW_BALANCE', `Your wallet balance is critically low: ${wallet.balance}`, 500);
                throw new Error('Insufficient balance in your wallet.');
                

            }else{
             transaction = await Transaction.handleCashOut(agentId, amount, metadata, MockExternalAPI.call);
            }
           


            return transaction;
        } catch (error) {
            console.error('WalletService.handleCashOut error:', error.message);
            throw error;
        }
    }
}

module.exports = WalletService;