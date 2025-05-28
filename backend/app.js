require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const alertRoutes = require('./routes/alertRoutes');
const prisma = require('./prismaClient'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Mini Wallet Management System API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/alerts', alertRoutes); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong!',
        status: err.statusCode || 500
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    prisma.$connect()
        .then(() => console.log('Successfully connected to database.'))
        .catch(e => console.error('Failed to connect to database:', e));
});

process.on('beforeExit', async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
});