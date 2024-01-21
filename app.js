const express = require('express');
const apiRouter = require('./routes/api-router');
const { handleInvalidEndpoints, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', handleInvalidEndpoints);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;