const {cities}  = require('./api.js')
const express = require('express');
const { rateLimit } = require('express-rate-limit')
const app = express();

const limiter = rateLimit({
  windowMs: 10 * 1000, // 5 requests 10 secs
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
})

app.get('/cities', limiter , cities)

app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });

