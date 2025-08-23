import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Cliente from '../models/Cliente';
import Estado from '../models/Estado';
import ZonaTelefonica from '../models/ZonaTelefonica';
import ZonaTelefonicaPorEstado from '../models/ZonaTelefonicaPorEstado';
import Cidade from '../models/Cidade';
import TipoVenda from '../models/TipoVenda';
import Pedido from '../models/Pedido';
import Portabilidade from '../models/Portabilidade';
import TermoContrato from '../models/TermoContrato';

const models = [
  Cliente,
  Estado,
  ZonaTelefonica,
  ZonaTelefonicaPorEstado,
  Cidade,
  TipoVenda,
  Pedido,
  Portabilidade,
  TermoContrato,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

export default connection;
