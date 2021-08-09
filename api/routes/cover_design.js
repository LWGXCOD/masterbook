const { Router } = require('express')
const router = Router()
const componentsController = require('../controllers/components')

router
  .get('/:id', componentsController.getCoverDesign)
  .post('/', componentsController.postCoverDesign)
  .delete('/:id', componentsController.deleteCoverDesign)
  .delete('/prepare-to-delete/:id', componentsController.prepareToDeleteCoverDesign)
  .put('/:id', componentsController.updateCoverDesign)
module.exports = router
