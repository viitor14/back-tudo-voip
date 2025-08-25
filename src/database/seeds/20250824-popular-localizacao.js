// Ficheiro: seeders/20250824-popular-localizacao.js

const estadosData = require('./ESTADOS.json');
const zonasData = require('./ZONA TELEFONICA - DDD.json');
const cidadesData = require('./CIDADES.json');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });

    await queryInterface.bulkDelete('cidade', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('zona_telefonica_por_estado', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('zona_telefonica', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('estado', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

    const estadosParaInserir = estadosData.map((e) => ({
      cod_estado: e.cod_estado,
      nome_estado: e.nome_estado,
      regiao: e.regiao,
      status: e.status === 'True',
    }));
    await queryInterface.bulkInsert('estado', estadosParaInserir, {});

    const zonasParaInserir = zonasData.map((z) => ({
      cod_zona_telefonica: z.cod_zona_telefonica,
      area_telefonica: z.area_telefonica,
      status: z.status === 'True',
    }));
    await queryInterface.bulkInsert('zona_telefonica', zonasParaInserir, {});

    const estadoMap = new Map(estadosData.map((e) => [e.nome_estado, e.cod_estado]));
    const zonaMap = new Map(zonasData.map((z) => [z.area_telefonica, z.cod_zona_telefonica]));
    const junctionMap = new Map();
    let nextJunctionId = 1;

    const cidadesParaInserir = [];
    const juncoesParaInserir = [];

    // Corrigido: Trocado o loop for...of por forEach
    cidadesData.forEach((cidade) => {
      const cod_estado = estadoMap.get(cidade.nome_estado);
      const cod_zona_telefonica = zonaMap.get(cidade.area_telefonica);

      if (cod_estado && cod_zona_telefonica) {
        const junctionKey = `${cod_estado}-${cod_zona_telefonica}`;
        let junctionId = junctionMap.get(junctionKey);

        if (!junctionId) {
          junctionId = nextJunctionId;
          // Corrigido: Trocado o ++ por += 1
          nextJunctionId += 1;

          junctionMap.set(junctionKey, junctionId);
          juncoesParaInserir.push({
            cod_zona_telefonica_por_estado: junctionId,
            cod_estado,
            cod_zona_telefonica,
          });
        }

        cidadesParaInserir.push({
          cod_cidade: cidade.cod_cidade,
          nome_cidade: cidade.nome_cidade,
          cod_zona_telefonica_por_estado: junctionId,
          status: true,
        });
      }
    });

    await queryInterface.bulkInsert('zona_telefonica_por_estado', juncoesParaInserir, {});
    await queryInterface.bulkInsert('cidade', cidadesParaInserir, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('cidade', null, {});
    await queryInterface.bulkDelete('zona_telefonica_por_estado', null, {});
    await queryInterface.bulkDelete('zona_telefonica', null, {});
    await queryInterface.bulkDelete('estado', null, {});
  },
};
