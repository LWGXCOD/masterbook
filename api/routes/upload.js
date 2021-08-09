const express = require('express')
const router = express.Router()
const { uploadFile, upload } = require('../controllers/upload')

router
  .use('/', express.static(`${__dirname}/uploads`))
  .post('/', upload.single('myFile'), uploadFile)

module.exports = router
