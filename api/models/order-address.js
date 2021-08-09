const Sequelize = require('sequelize')

class Order_address extends Sequelize.Model {
  static initialize(sequelize) {
    Order_address.init({}, { sequelize: sequelize, modelName: 'Order_address', tableName: 'order_address' })
  }
}

module.exports = Order_address