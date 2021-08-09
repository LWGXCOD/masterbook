const { Router } = require('express')
const router = Router()
const presetsController = require('../controllers/presets')

router
  .get('/:id', presetsController.getPreset)
  .post('/', presetsController.postPreset)
  .delete('/:id', presetsController.deletePreset)
  .put('/:id', presetsController.updatePreset)
module.exports = router
