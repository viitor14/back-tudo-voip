import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/User';
import Cliente from '../models/Cliente';

const models = [User, Cliente];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

export default connection;
