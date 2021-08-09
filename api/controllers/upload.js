const { Api400Error } = require('../utils/error')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })

module.exports = {
  async uploadFile(req, res, next) {
    try {
      let fileData = req.file
      console.log(fileData)
      if (!fileData) throw new Api400Error(`No file in request`)
      res.send(fileData)
    } catch (err) {
      next(err)
    }
  },
  upload
}