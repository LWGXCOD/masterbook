const Sequelize = require('sequelize')

class Category extends Sequelize.Model {
  static initialize(sequelize) {
    Category.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        uniqueKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      imageURL: {
        type: Sequelize.STRING(3000),
        allowNull: false
      },
      relevance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      sequelize: sequelize,
      modelName: 'Category',
      tableName: 'category'
    })
  }
}

module.exports = Category