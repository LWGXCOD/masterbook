const Sequelize = require('sequelize')

class Address extends Sequelize.Model {
  static initialize(sequelize) {
    Address.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      cookie: {
        type: Sequelize.STRING,
        allowNull: false
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postal_code: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      house: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apartment: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    }, {
      sequelize: sequelize,
      modelName: 'Address',
      tableName: 'address'
    })
  }
}

module.exports = Address