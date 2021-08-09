const { Router } = require('express')
const router = Router()
const cartController = require('../controllers/cart')

router
  .get('/', cartController.getCart)
  .post('/', cartController.addToCart)
  .delete('/:id', cartController.removeFromCart)
  .put('/inc/:id', cartController.incrementProductCount)
  .put('/dec/:id', cartController.decrementProductCount)
module.exports = router
