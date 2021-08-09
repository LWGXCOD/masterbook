require('dotenv').config()

const express = require('express')
const { syncDbTables, initializeDbModels } = require('./utils/db')
const sequelize = require('./models')
const app = express()
const cors = require('cors')
const { logError, returnError } = require('../api/utils/errorHandler')
const cookieParser = require('cookie-parser')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SECRET_COOKIE_KEY));

(async function initDB() {
  try {
    initializeDbModels(sequelize)
    await syncDbTables()
  } catch (err) {
    console.log(err)
  }
})()
app.use('/', require('./utils/cookieCheck'))
app.use('/api', require('./routes/api'))
app.use((req, res) =>
  res.status(404).json({ error: { type: 'URL NOT FOUND', code: 404 } }))
app.use(logError)
app.use(returnError)

app.listen(process.env.NODEJS_LOCAL_PORT || 3000, () => console.log('Listen on ', process.env.NODEJS_LOCAL_PORT || 3000))