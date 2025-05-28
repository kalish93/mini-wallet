const AuthService = require('../services/authService');

class AuthController {
    static async register(req, res, next) {
        const { name, email, password, idNumber } = req.body;
        if (!name || !email || !password || !idNumber) {
            return res.status(400).json({ message: 'All fields are required for registration.' });
        }
        try {
            const newAgent = await AuthService.registerAgent(name, email, password, idNumber);
            res.status(201).json({ message: 'Agent registered successfully.', agent: newAgent });
        } catch (error) {
            if (error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message }); 
            }
            next(error); 
        }
    }

    static async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        try {
            const { token, agent } = await AuthService.loginAgent(email, password);
            res.status(200).json({ message: 'Logged in successfully.', token, agent });
        } catch (error) {
            if (error.message.includes('Invalid credentials')) {
                return res.status(401).json({ message: error.message }); 
            }
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : 'N/A';
            const result = await AuthService.logoutAgent(token);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;