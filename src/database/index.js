import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/User';
import Cliente from '../models/Cliente';
import Pedido from '../models/Pedido';

const models = [User, Cliente, Pedido];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

export default connection;
