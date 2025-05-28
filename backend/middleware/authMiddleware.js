const jwt = require('jsonwebtoken');
const Agent = require('../models/agent'); 
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.agent = decoded; 

        const agent = await Agent.getAgentById(req.agent.agentId);
        if (!agent) {
            return res.status(401).json({ message: 'Token is invalid or agent no longer exists.' });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Token invalid or corrupted. Authorization denied.' });
    }
};

module.exports = authMiddleware;