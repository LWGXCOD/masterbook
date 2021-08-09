const { Router } = require('express')
const router = Router()
const componentsController = require('../controllers/components')

router
  .use('/cover-design', require('./cover_design'))
  .use('/inner-filling', require('./inner_filling'))
  .get('/cover-designs', componentsController.getCoverDesigns)
  .get('/inner-fillings', componentsController.getInnerFillings)
module.exports = router
