const Cart = require('../models/cart')
const { Api404Error, Api400Error } = require('../utils/error')
const Presets = require('../models/presets')
const Cover_design = require('../models/cover_design')
const Inner_filling = require('../models/inner_filling')
const Category = require('../models/category')

module.exports = {
  async getCart(req, res, next) {
    try {
      let cart = await Cart.findAll({
        where: {
          cookie: req.signedCookies.uuid,
          relevance: true
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'cookie', 'relevance', 'id_preset']
        },
        include: [
          {
            model: Presets,
            attributes: { exclude: ['createdAt', 'updatedAt', 'cookie', 'relevance', 'id_cover_design', 'order'] },
            where: { relevance: true },
            include: [{
              model: Cover_design,
              as: 'coverDesign',
              attributes: { exclude: ['createdAt', 'updatedAt', 'relevance'] },
              where: { relevance: true }
            },
              {
                model: Inner_filling,
                as: 'innerFillings',
                attributes: { exclude: ['createdAt', 'updatedAt', 'relevance'] },
                through: { attributes: [] },
                where: { relevance: true }
              },
              {
                model: Category,
                as: 'categories',
                attributes: { exclude: ['createdAt', 'updatedAt', 'relevance'] },
                through: { attributes: [] },
                where: { relevance: true },
                required: false
              }]
          }
        ]
      })
      return res.send(cart)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async addToCart(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      let preset = await Presets.findByPk(req.body.id_preset)
      if (!preset) throw new Api404Error(`Preset with id: ${req.body.id_preset} not found`, req.body.id_preset)
      let cart = await Cart.findOne({
        where: {
          id_preset: req.body.id_preset,
          relevance: true,
          cookie: req.signedCookies.uuid
        }
      })
      if (!cart) {
        await Cart.create({
          cookie: req.signedCookies.uuid,
          id_preset: req.body.id_preset,
          count: 1,
          relevance: true
        })
      }
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async removeFromCart(req, res, next) {
    try {
      let cart = await Cart.findOne({
        where: {
          id_preset: req.params.id,
          cookie: req.signedCookies.uuid,
          relevance: true
        }
      })
      if (!cart) throw new Api404Error(`Cart with id_preset:${req.params.id} not found`, { id_preset: req.params.id })
      cart = await Cart.update(
        { relevance: false },
        { where: { id_preset: req.params.id, cookie: req.signedCookies.uuid, relevance: true } })
      res.send()
    } catch (err) {
      next(err)
    }
  },
  async incrementProductCount(req, res, next) {
    try {
      let cart = await Cart.findOne({
        where: {
          id_preset: req.params.id,
          cookie: req.signedCookies.uuid,
          relevance: true
        }
      })
      if (!cart) throw new Api404Error(`Cart with id_preset:${req.params.id} not found`, { id_preset: req.params.id })
      console.log(`cart:`, cart.count)
      await Cart.update(
        { count: (cart.count + 1) },
        { where: { id_preset: req.params.id, cookie: req.signedCookies.uuid, relevance: true } })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async decrementProductCount(req, res, next) {
    try {
      let cart = await Cart.findOne({
        where: {
          id_preset: req.params.id,
          cookie: req.signedCookies.uuid,
          relevance: true
        }
      })
      if (!cart) throw new Api404Error(`Cart with id_preset:${req.params.id} not found`, { id_preset: req.params.id })
      console.log(`cart:`, cart.count)
      if (cart.count > 0) {
        await Cart.update(
          { count: (cart.count - 1) },
          { where: { id_preset: req.params.id, cookie: req.signedCookies.uuid, relevance: true } })
      }
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}