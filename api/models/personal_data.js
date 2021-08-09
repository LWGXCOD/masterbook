const Sequelize = require('sequelize')

class Personal_data extends Sequelize.Model {
  static initialize(sequelize) {
    Personal_data.init({
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
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      patronymic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      sequelize: sequelize,
      modelName: 'Personal_data',
      tableName: 'personal_data'
    })
  }
}

module.exports = Personal_data