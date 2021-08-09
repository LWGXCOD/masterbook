const Sequelize = require('sequelize')

class Inner_filling_preset extends Sequelize.Model {
  static initialize(sequelize) {
    Inner_filling_preset.init({}, {
      sequelize: sequelize,
      modelName: 'Inner_filling_preset',
      tableName: 'inner_filling_preset'
    })
  }
}

module.exports = Inner_filling_preset