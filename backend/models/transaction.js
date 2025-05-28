const prisma = require('../prismaClient');
const Wallet = require('./wallet');
const MockExternalAPI = require('../mockApi'); 

class Transaction {
    static async record(agentId, type, amount, status, externalTransactionId = null, metadata = {}, tx = prisma) {
        try {
            const transaction = await tx.transaction.create({
                data: {
                    agent: { connect: { id: agentId } },
                    type,
                    amount,
                    status,
                    externalTransactionId,
                    metadata,
                },
            });
            return transaction;
        } catch (error) {
            console.error('Error recording transaction:', error);
            throw error;
        }
    }

    static async getRecentByAgentId(agentId, limit = 50) {
        try {
            const transactions = await prisma.transaction.findMany({
                where: { agentId },
                orderBy: { createdAt: 'desc' },
                take: limit, 
            });
            return transactions;
        } catch (error) {
            console.error('Error getting recent transactions:', error);
            throw error;
        }
    }

    
    static async handleCashIn(agentId, amount, metadata) {
        try {
            const transactionResult = await prisma.$transaction(async (tx) => {
                const mockResponse = await MockExternalAPI.call('cash_in', amount);
                if (mockResponse.status !== 'SUCCESS') {
                    throw new Error(mockResponse.message || 'Mock API cash-in failed');
                }

                const updatedWallet = await Wallet.updateBalance(agentId, amount, tx); 

                const transactionRecord = await this.record(
                    agentId,
                    'CASH_IN',
                    amount,
                    'SUCCESS',
                    mockResponse.externalTransactionId,
                    { ...metadata, mockApiDetails: mockResponse },
                    tx 
                );

                

                return transactionRecord;
            });
            return transactionResult;
        } catch (error) {
            console.error('Cash-in transaction failed:', error);
            throw error;
        }
    }

  
    static async handleCashOut(agentId, amount, metadata) {
        try {
            const transactionResult = await prisma.$transaction(async (tx) => {
                const currentWallet = await tx.wallet.findUnique({
                    where: { agentId },
                });
                if (!currentWallet || currentWallet.balance.lessThan(amount + 100)) { 
                    throw new Error('Insufficient balance in agent wallet.');
                }

                const mockResponse = await MockExternalAPI.call('cash_out', amount);
                if (mockResponse.status !== 'SUCCESS') {
                    throw new Error(mockResponse.message || 'Mock API cash-out failed');
                }

                const updatedWallet = await Wallet.updateBalance(agentId, -amount, tx); 

                const transactionRecord = await this.record(
                    agentId,
                    'CASH_OUT',
                    amount,
                    'SUCCESS',
                    mockResponse.externalTransactionId,
                    { ...metadata, mockApiDetails: mockResponse },
                    tx 
                );

                

                return transactionRecord;
            });
            return transactionResult;
        } catch (error) {
            console.error('Cash-out transaction failed:', error);
            throw error;
        }
    }
}

module.exports = Transaction;

