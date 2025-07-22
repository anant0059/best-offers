import express from 'express';
import cors from 'cors';
import Routes from './routes/Routes.js';
import Initializer from './app/Initializers/Initializer.js';
import Logger from './app/Utils/Logger.js';
import config from './config/config.js';
import { errorHandler } from './app/Middlewares/errorHandler.js';

config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({status: 'ok', message: 'Welcome to BestOffer API!'});
});

app.use('/bestoffer/api/health/', Routes.HealthApi);

app.use(errorHandler);

process.on('uncaughtException', (reason) => {
  Logger.error('uncaughtException', new Error(reason));
});

// initalizing global required services and creating server
Promise.all(Initializer.intializeServices())
  .then(() => {
    app.listen(process.bestoffer.app.port, () => {
      Logger.info(`Server Started Successfully on ${process.bestoffer.app.port}`);
    });
  })
  .catch((error) => {
    Logger.error('InitiailizeServices', new Error(error));
  });