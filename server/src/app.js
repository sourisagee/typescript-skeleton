const express = require('express');
const serverConfig = require('./config/serverConfig');
const mainRouter = require('./routes/main.routes');

const app = express();
const PORT = 3000 ?? process.env.PORT;

serverConfig(app);

app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
