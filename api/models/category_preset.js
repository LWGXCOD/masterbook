const Sequelize = require('sequelize')

class Category_preset extends Sequelize.Model {
  static initialize(sequelize) {
    Category_preset.init({}, { sequelize: sequelize, modelName: 'Category_preset', tableName: 'category_preset' })
  }
}

module.exports = Category_preset