const express = require('express');
const apiRouter = require('./routes/api-router');
const { 
    handleCustomErrors, 
    handlePsqlErrors, 
    handleServerErrors 
} = require('./errors/index');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', (req, res) => {
    res.status(404).send({msg: "Not Found - endpoint does not exist"})
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;