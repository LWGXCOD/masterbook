const { Router } = require('express')
const router = Router()
const categoryController = require('../controllers/category')

router
  .get('/:id/presets', categoryController.getCategory)
  .post('/', categoryController.postCategory)
  .delete('/:id', categoryController.deleteCategory)
  .put('/:id', categoryController.updateCategory)

module.exports = router
