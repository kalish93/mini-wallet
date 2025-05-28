const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Agent {
    static async create(name, email, password, idNumber) {
        try {
            const passwordHash = await bcrypt.hash(password, saltRounds);

          
            const newAgentWithWallet = await prisma.$transaction(async (prisma) => {
                const agent = await prisma.agent.create({
                    data: {
                        name,
                        email,
                        passwordHash,
                        idNumber,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        idNumber: true,
                        createdAt: true,
                    }
                });

                await prisma.wallet.create({
                    data: {
                        balance: 0.0,
                        agentId: agent.id, 
                    }
                });

                return agent; 
            });

            return newAgentWithWallet; 

        } catch (error) {
            console.error('Error creating agent:', error);
            if (error.code === 'P2002') { 
                throw new Error('Email or ID number already registered.');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const agent = await prisma.agent.findUnique({
                where: { email },
            });
            return agent;
        } catch (error) {
            console.error('Error finding agent by email:', error);
            throw error;
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    static async getAgentById(id) {
        try {
            const agent = await prisma.agent.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    idNumber: true,
                    createdAt: true,
                }
            });
            return agent;
        } catch (error) {
            console.error('Error getting agent by ID:', error);
            throw error;
        }
    }
}

module.exports = Agent;