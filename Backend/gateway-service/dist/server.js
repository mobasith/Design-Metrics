"use strict";
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 2000;
app.use('/users', createProxyMiddleware({ target: 'http://localhost:3000/api/users' }));
app.use('/feedbacks', createProxyMiddleware({ target: 'http://localhost:3001/api/feedback' }));
app.use('/designs', createProxyMiddleware({ target: 'http://localhost:3002/api/designs' }));
app.use('/analytics', createProxyMiddleware({ target: 'http://localhost:3003/api/analytics' }));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
