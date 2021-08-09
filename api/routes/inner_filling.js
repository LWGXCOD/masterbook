const { Router } = require('express')
const router = Router()
const componentsController = require('../controllers/components')

router
  .get('/:id', componentsController.getInnerFilling)
  .post('/', componentsController.postInnerFilling)
  .delete('/:id', componentsController.deleteInnerFilling)
  .delete('/prepare-to-delete/:id', componentsController.prepareToDeleteInnerFilling)
  .put('/:id', componentsController.updateInnerFilling)
module.exports = router
