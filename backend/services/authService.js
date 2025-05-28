const Agent = require('../models/agent');
const Alert = require('../models/alert');
const Wallet = require('../models/wallet'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
    static async registerAgent(name, email, password, idNumber) {
        try {
            const existingAgent = await Agent.findByEmail(email);
            if (existingAgent) {
                throw new Error('Agent with this email already exists.');
            }

            const newAgent = await Agent.create(name, email, password, idNumber);
            await Wallet.createForAgent(newAgent.id);

            return { id: newAgent.id, name: newAgent.name, email: newAgent.email };
        } catch (error) {
            console.error('AuthService.registerAgent error:', error.message);
            throw error;
        }
    }

    static async loginAgent(email, password) {
        try {
            const agent = await Agent.findByEmail(email);
            if (!agent) {
                throw new Error('Invalid credentials: Agent not found.');
            }

            const isMatch = await Agent.comparePassword(password, agent.passwordHash);
            if (!isMatch) {
                throw new Error('Invalid credentials: Password mismatch.');
            }

            const token = jwt.sign(
                { agentId: agent.id, email: agent.email },
                process.env.JWT_SECRET,
                { expiresIn: '30m' } 
            );
            const wallet = await Wallet.getByAgentId(agent.id);

            // if(wallet.balance >= 100 && wallet.balance <= 200 ){

            //  await Alert.create(agent.id, 'LOW_BALANCE', `Your wallet balance is critically low: ${wallet.balance}`, 500);
            // }

            return { token, agent: { id: agent.id, name: agent.name, email: agent.email } };
        } catch (error) {
            console.error('AuthService.loginAgent error:', error.message);
            throw error;
        }
    }

    static async logoutAgent(token) {
        
        console.log(`Agent with token ${token.substring(0, 10)}... has logged out.`);
        return { message: 'Logged out successfully (token may still be valid until expiry if no blacklist).' };
    }
}

module.exports = AuthService;