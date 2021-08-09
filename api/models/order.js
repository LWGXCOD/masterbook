const Sequelize = require('sequelize')

class Order extends Sequelize.Model {
  static initialize(sequelize) {
    Order.init({
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
      status: {
        type: Sequelize.ENUM('not completed', 'not paid', 'paid', 'canceled'),
        allowNull: false
      }
    }, {
      sequelize: sequelize,
      modelName: 'Order',
      tableName: 'order'
    })
  }
}

module.exports = Order