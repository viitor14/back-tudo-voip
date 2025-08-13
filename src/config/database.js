require('dotenv').config();

module.exports = {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    timezone: '-03:00',
  },
  timezone: '-03:00',
};

/*

Configuração para usar no RENDER.COM
module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres', // Defina o dialect como PostgreSQL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Permite conexões com certificados SSL genéricos
    },
  },
  define: {
    timestamps: true, // Ativa os campos createdAt e updatedAt
    underscored: true, // Converte nomes para snake_case
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
*/
