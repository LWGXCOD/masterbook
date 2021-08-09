const Order = require('../models/order')
const PersonalData = require('../models/personal_data')
const Address = require('../models/address')
const { Api404Error, Api400Error } = require('../utils/error')

module.exports = {
  async createOrder(req, res, next) {
    try {
      await Order.create({
        cookie: req.signedCookies.uuid,
        status: 'not completed'
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async addPersonalData(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      let userData = await PersonalData.create({
        cookie: req.signedCookies.uuid,
        name: req.body.name,
        surname: req.body.surname,
        patronymic: req.body.patronymic,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      })
      let order = await Order.findOne({
        where: { cookie: req.signedCookies.uuid },
        order: [['createdAt', 'DESC']]
      })
      await order.addPersonalData(userData)
      await order.update({
        status: 'not paid'
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async addAddress(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      let userAddress = await Address.create({
        cookie: req.signedCookies.uuid,
        region: req.body.region,
        postal_code: req.body.postal_code,
        city: req.body.city,
        street: req.body.street,
        house: req.body.house,
        apartment: req.body.apartment
      })
      let order = await Order.findOne({
        where: { cookie: req.signedCookies.uuid },
        order: [['createdAt', 'DESC']]
      })
      await order.addAddress(userAddress)
      await order.update({
        status: 'not paid'
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async getOrderAddressAndPersonalData(req, res, next) {
    try {
      let address = await Address.findOne({
        where: { cookie: req.signedCookies.uuid },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['cookie','id','createdAt','updatedAt'] }
      })
      let personalData = await PersonalData.findOne({
        where: { cookie: req.signedCookies.uuid },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['cookie','id','createdAt','updatedAt'] }
      })
      res.send({ address: address, personalData: personalData })
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  }
}