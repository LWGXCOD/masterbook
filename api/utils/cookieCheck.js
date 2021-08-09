const cookieParser = require('cookie-parser')
const {v4: uuidv4} = require('uuid')

async function cookieCheck(req, res, next) {
    try {
        // console.log(`req.signedCookies 1:`, req.signedCookies)
        if(!req.signedCookies.uuid) res.cookie('uuid', uuidv4(),{signed: true})
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = cookieCheck