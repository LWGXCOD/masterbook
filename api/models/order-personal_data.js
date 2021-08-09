const Sequelize = require('sequelize')

class Order_personalData extends Sequelize.Model {
  static initialize(sequelize) {
    Order_personalData.init({}, { sequelize: sequelize, modelName: 'Order_personalData', tableName: 'order_personalData' })
  }
}

module.exports = Order_personalData