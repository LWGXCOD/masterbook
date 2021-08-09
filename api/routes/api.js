const { Router } = require('express')
const router = Router()
const { uploadFile } = require('./upload')
const categoryController = require('../controllers/category')
const presetsController = require('../controllers/presets')

router
  .use('/components', require('./components'))
  .use('/preset', require('./presets'))
  .use('/category', require('./category'))
  .use('/order', require('./order'))
  .use('/upload', require('./upload'))
  .get('/categories', categoryController.getCategories)
  .get('/presets', presetsController.getPresets)
  .use('/cart', require('./cart'))

module.exports = router