import dotenv from 'dotenv';

dotenv.config();

import './database';

import express from 'express';
import cors from 'cors';

import homeRoutes from './routes/homeRoutes';
import tokenRoutes from './routes/tokenRoutes';
import userRoutes from './routes/userRoutes';
import registroRoutes from './routes/registroRoutes';
import pedidoRoutes from './routes/pedidoRoutes';

const whiteList = ['http://localhost:3000', 'https://cejumic.vercel.app'];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/registro/', registroRoutes);
    this.app.use('/pedido/', pedidoRoutes);
  }
}

export default new App().app;
