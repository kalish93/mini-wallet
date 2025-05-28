// // src/lib/redis.js
// const Redis = require('ioredis'); // Change import to require

// // Load Redis connection URL from environment variables
// const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// const redis = new Redis(redisUrl, {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: true,
// });

// redis.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redis.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// module.exports = redis; // Change export default to module.exports