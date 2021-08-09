const Sequelize = require('sequelize')

class Cart extends Sequelize.Model {
  static initialize(sequelize) {
    Cart.init({
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
      count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_preset: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      relevance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      sequelize: sequelize,
      modelName: 'Cart',
      tableName: 'cart'
    })
  }
}

module.exports = Cart