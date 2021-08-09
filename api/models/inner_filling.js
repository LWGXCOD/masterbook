const Sequelize = require('sequelize')

class Inner_filling extends Sequelize.Model {
  static initialize(sequelize) {
    Inner_filling.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
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
      price: {
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
      modelName: 'Inner_filling',
      tableName: 'inner_filling'
    })
  }
}

module.exports = Inner_filling