const express = require('express');
const apiRouter = require('./routes/api-router');
const { handleInvalidEndpoints, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', handleInvalidEndpoints);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;