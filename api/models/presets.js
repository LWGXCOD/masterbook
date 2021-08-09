const Sequelize = require('sequelize')

class Presets extends Sequelize.Model {
  static initialize(sequelize) {
    Presets.init({
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
      id_cover_design: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cover_design', key: 'id' }
      },
      relevance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      order: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      sequelize: sequelize,
      modelName: 'Presets',
      tableName: 'presets'
    })
  }
}

module.exports = Presets