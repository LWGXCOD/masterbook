const Sequelize = require('sequelize')

class Cover_design extends Sequelize.Model {
  static initialize(sequelize) {
    Cover_design.init({
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
      modelName: 'Cover_design',
      tableName: 'cover_design'
    })
  }
}

module.exports = Cover_design