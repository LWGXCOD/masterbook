const Cover_design = require('../models/cover_design')
const Inner_filling = require('../models/inner_filling')
const Presets = require('../models/presets')
const { Api404Error, Api400Error } = require('../utils/error')
const { sequelize } = require('../models/index')

module.exports = {
  async getCoverDesigns(req, res, next) {
    try {
      let { page, limit, sortFields, sortType } = req.query
      let options = {
        where: { relevance: true },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        },
        include: [
          {
            model: Presets,
            as: 'presets',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true },
            required: false
          }
        ]
      }
      if (page) {
        limit = +(limit ?? 10)
        options.limit = limit
        options.offset = (page - 1) * limit
      }
      if (sortFields) {
        sortFields = sortFields.split(',')
        let order = []
        sortFields.forEach((field) => {
          order.push([field, sortType || 'ASC'])
        })
        options.order = order
      }
      let data = await Cover_design.findAndCountAll(options)
      return res.send(data)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async getInnerFillings(req, res, next) {
    try {
      let { page, limit, sortFields, sortType } = req.query
      let options = {
        where: { relevance: true },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        },
        include: [
          {
            model: Presets,
            as: 'presets',
            through: { attributes: [] },
            attributes: { exclude: ['createdAt', 'updatedAt', 'id_cover_design'] },
            where: { relevance: true },
            required: false
          }
        ]
      }
      if (page) {
        limit = +(limit ?? 10)
        options.limit = limit
        options.offset = (page - 1) * limit
      }
      if (sortFields) {
        sortFields = sortFields.split(',')
        let order = []
        sortFields.forEach((field) => {
          order.push([field, sortType || 'ASC'])
        })
        options.order = order
      }
      let innerFillings = await Inner_filling.findAndCountAll(options)
      return res.send(innerFillings)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async postInnerFilling(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      await Inner_filling.create({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        price: req.body.price
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async postCoverDesign(req, res, next) {
    try {
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      await Cover_design.create({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        price: req.body.price
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  async getCoverDesign(req, res, next) {
    try {
      let data = await Cover_design.findOne({
        where: {
          id: req.params['id'],
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
            where: { relevance: true },
            required: false
          }
        ]
      })
      if (!data) throw new Api404Error(`Cover design with id: ${req.params.id} not found`, { id: req.params.id })
      res.send(data)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async getInnerFilling(req, res, next) {
    try {
      let inner_filling = await Inner_filling.findOne({
        where: {
          id: req.params['id'],
          relevance: true
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        },
        include: [
          {
            model: Presets,
            as: 'presets',
            through: { attributes: [] },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true },
            required: false
          }
        ]
      })
      if (!inner_filling) throw new Api404Error(`Category with id:${req.params.id} not found`, { id: req.params.id })
      res.send(inner_filling)
    } catch (err) {
      next(err)
    }
  },
  async deleteCoverDesign(req, res, next) {
    try {
      let coverDesign = await Cover_design.findByPk(req.params['id'])
      if (!coverDesign) throw new Api404Error(`Cover design with id:${req.params.id} not found`, { id: req.params.id })
      let updatedPresets = await Presets.update({ relevance: false },
        { where: { id_cover_design: req.params['id'] } })
      coverDesign = await Cover_design.update(
        { relevance: false },
        { where: { id: req.params['id'] } })
      res.send()
    } catch (err) {
      next(err)
    }
  },
  async deleteInnerFilling(req, res, next) {
    try {
      let innerFilling = await Inner_filling.findByPk(req.params['id'])
      if (!innerFilling) throw new Api404Error(`Inner filling with id:${req.params.id} not found`, { id: req.params.id })
      let presets = await innerFilling.getPresets({ where: { relevance: true } })
      let presetsIds = presets.map(preset => {
        return preset.id
      })
      await Presets.update({ relevance: false },
        {
          where: { id: presetsIds }
        })
      innerFilling = await Inner_filling.update(
        { relevance: false },
        {
          where: { id: req.params['id'] }
        })
      res.send()
    } catch (err) {
      next(err)
    }
  },
  async prepareToDeleteCoverDesign(req, res, next) {
    try {
      let coverDesign = await Cover_design.findOne({
        where: {
          id: req.params['id'],
          relevance: true
        }
      })
      if (!coverDesign) throw new Api404Error(`Cover design with id:${req.params.id} not found`, { id: req.params.id })
      let presetToDelete = await Presets.findAll({
        where: {
          id_cover_design: req.params['id'],
          relevance: true
        }
      })
      res.send({ presetToDelete })
    } catch (err) {
      next(err)
    }
  },
  async prepareToDeleteInnerFilling(req, res, next) {
    try {
      let innerFilling = await Inner_filling.findOne({
        where: {
          id: req.params['id'],
          relevance: true
        }
      })
      if (!innerFilling) throw new Api404Error(`Inner filling with id:${req.params.id} not found`, { id: req.params.id })
      let presetsToDelete = await innerFilling.getPresets({
        where: { relevance: true },
        attributes: {
          exclude: ['id_cover_design']
        },
        joinTableAttributes: []
      })
      res.send({ presetsToDelete })
    } catch (err) {
      next(err)
    }
  },
  async updateInnerFilling(req, res, next) {
    try {
      let inner_filling = await Inner_filling.findOne({ where: { id: req.params.id, relevance: true } })
      if (!inner_filling) throw new Api404Error(`Inner filling with id:${req.params.id} not found`, { id: req.params.id })
      let result = await Inner_filling.update(
        {
          name: req.body.name || inner_filling.name,
          description: req.body.description || inner_filling.description,
          imageURL: req.body.imageURL || inner_filling.imageURL,
          price: req.body.price || inner_filling.price
        },
        { where: { id: req.params.id, relevance: true } })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }

  },
  async updateCoverDesign(req, res, next) {
    try {
      let cover_design = await Cover_design.findOne({ where: { id: req.params.id, relevance: true } })
      if (!cover_design) throw new Api404Error(`Cover design with id:${req.params.id} not found`, { id: req.params.id })
      let result = await Cover_design.update(
        {
          name: req.body.name || cover_design.name,
          description: req.body.description || cover_design.description,
          imageURL: req.body.imageURL || cover_design.imageURL,
          price: req.body.price || cover_design.price
        },
        { where: { id: req.params.id, relevance: true } })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }

  }
}