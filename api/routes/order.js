const { Router } = require('express')
const router = Router()
const orderController = require('../controllers/order')

router
  .post('/create', orderController.createOrder)
  .post('/addPersonalData',orderController.addPersonalData)
  .post('/addAddress',orderController.addAddress)
  .get('/user-data',orderController.getOrderAddressAndPersonalData)

module.exports = router