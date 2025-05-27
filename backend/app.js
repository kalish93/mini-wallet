// backend/app.js
const express = require('express');
const app = express();

app.use(express.json()); // for parsing JSON bodies

// Import routes
const walletRoutes = require('./routes/walletRoutes');
app.use('/api/wallet', walletRoutes);

// Global error handler (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;
