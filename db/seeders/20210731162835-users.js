'use strict';

const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('Users', [{
        name: "adminUser",
        email: "adminuser@example.com",
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
       },
       {
        name: "regularUser",
        email: "regularuser@example.com",
        password: bcrypt.hashSync(process.env.REGULAR_PASSWORD, bcrypt.genSaltSync(10)),
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users', null, {});
     
  }
};
