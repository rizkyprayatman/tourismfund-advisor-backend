'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Admin } = require('../models'); 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = process.env.ADMIN_PASSWORD;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      username: 'admin',
      password: hashedPassword,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await Admin.destroy({ where: { username: 'admin' } });
  },
};
