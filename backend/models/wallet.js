const prisma = require('../prismaClient');

class Wallet {
    static async createForAgent(agentId, initialBalance = 0.00, currency = 'USD') {
        try {
            const wallet = await prisma.wallet.create({
                data: {
                    agent: { connect: { id: agentId } }, 
                    balance: initialBalance,
                    currency,
                },
            });
            return wallet;
        } catch (error) {
            console.error('Error creating wallet for agent:', error);
            throw error;
        }
    }

    static async getByAgentId(agentId) {
        try {
            const wallet = await prisma.wallet.findUnique({
                where: { agentId },
            });
            return wallet;
        } catch (error) {
            console.error('Error getting wallet by agent ID:', error);
            throw error;
        }
    }

   
    static async updateBalance(agentId, amount, tx = prisma) {
        try {
            const wallet = await tx.wallet.update({
                where: { agentId },
                data: {
                    balance: { increment: amount }, 
                    updatedAt: new Date(),
                },
            });
            if (wallet.balance.lessThan(0)) { 
                throw new Error('Wallet balance cannot be negative.');
            }
            return wallet;
        } catch (error) {
            console.error('Error updating wallet balance:', error);
            throw error;
        }
    }
}

module.exports = Wallet;

