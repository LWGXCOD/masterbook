const Sequelize = require('sequelize')

class Order_cart extends Sequelize.Model {
  static initialize(sequelize) {
    Order_cart.init({}, { sequelize: sequelize, modelName: 'Order_cart', tableName: 'order_cart' })
  }
}

module.exports = Order_cart