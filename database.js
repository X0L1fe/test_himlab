// database.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: console.error, // Логирование только ошибок
});

export default sequelize;
