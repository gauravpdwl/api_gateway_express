const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Apply middleware
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:3000/"],
    credentials: true
  }));
app.use(helmet());
app.use(morgan('dev'));

// Define API Gateway configurations (replace with your actual service details)
const services = [
  {
    id: 'auth-service',
    path: '/api/auth',
    target: 'http://localhost:8081/', // Replace with your user service URL
  },
  {
    id: 'catalog-service',
    path: '/api/catalog',
    target: 'http://localhost:8080/', // Replace with your product service URL
  },
  {
    id: 'order-service',
    path: '/api/order',
    target: 'http://localhost:5503/', // Replace with your product service URL
  }
];

// Create proxy middleware for each service
services.forEach((service) => {
  app.use(service.path, createProxyMiddleware({ target: service.target }));
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error - API Gateway');
});

const port = process.env.PORT || 8000; // Use environment variable or default port

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
