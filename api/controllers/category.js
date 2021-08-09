const Category = require('../models/category')
const { Api404Error, Api400Error } = require('../utils/error')
const Presets = require('../models/presets')

module.exports = {
  async getCategories(req, res, next) {
    try {
      let categories = await Category.findAll({
        where: {
          relevance: true
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        },
        include: [
          {
            model: Presets,
            as: 'presets',
            attributes: { exclude: ['createdAt', 'updatedAt', 'id_cover_design'] },
            through: { attributes: [] },
            where: { relevance: true },
            required: false
          }
        ]
      })
      return res.send({ categories })
    } catch (err) {
      next(err)
    }
  },
  async postCategory(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      await Category.create({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async getCategory(req, res, next) {
    try {
      let { page, limit, sortFields, sortType } = req.query
      let extendedOptions = {}
      if (page) {
        limit = +(limit ?? 10)
        extendedOptions.limit = limit
        extendedOptions.offset = (page - 1) * limit
      }
      if (sortFields) {
        sortFields = sortFields.split(',')
        let order = []
        sortFields.forEach((field) => {
          order.push([field, sortType || 'ASC'])
        })
        extendedOptions.order = order
      }

      let category = await Category.findOne({
        where: {
          id: req.params['id'],
          relevance: true
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        }
      })
      if (!category) throw new Api404Error(`Category with id: ${req.params.id} not found`, { id: req.params.id })
      let countPresets = await category.countPresets()
      let presetsByCategory = await category.getPresets({
        where: { relevance: true },
        required: false,
        attributes: {
          exclude: ['id_cover_design', 'createdAt', 'updatedAt']
        },
        joinTableAttributes: [],
        ...extendedOptions
      })
      if (!category) throw new Api404Error(`Category with id:${req.params.id} not found`, { id: req.params.id })
      res.send({ count: countPresets, rows: presetsByCategory })
    } catch (err) {
      //console.log(`err:`, err)
      next(err)
    }
  },
  async deleteCategory(req, res, next) {
    try {
      let category = await Category.findByPk(req.params['id'])
      if (!category) throw new Api404Error(`Category with id:${req.params.id} not found`, { id: req.params.id })
      category = await Category.update(
        { relevance: false },
        { where: { id: req.params['id'] } })
      res.send()
    } catch (err) {
      next(err)
    }
  },
  async updateCategory(req, res, next) {
    try {
      let category = await Category.findOne({ where: { id: req.params.id, relevance: true } })
      if (!category) throw new Api404Error(`Category with id:${req.params.id} not found`, { id: req.params.id })
      let result = await Category.update(
        {
          name: req.body.name || category.name,
          description: req.body.description || category.description,
          imageURL: req.body.imageURL || category.imageURL,
          min_price: req.body.min_price || category.min_price
        },
        { where: { id: req.params.id, relevance: true } })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }

  }

}