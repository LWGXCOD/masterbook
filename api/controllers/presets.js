const Cover_design = require('../models/cover_design')
const Inner_filling = require('../models/inner_filling')
const Presets = require('../models/presets')
const Category = require('../models/category')
const Category_preset = require('../models/category_preset')
const Inner_filling_preset = require('../models/inner_filling_preset')
const { Api404Error, Api400Error } = require('../utils/error')

module.exports = {
  async getPresets(req, res, next) {
    let { page, limit, sortFields, sortType } = req.query
    try {
      let options = {
        where: { relevance: true },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category', 'CoverDesignId', 'InnerFillingId', 'CategoryId']
        },
        include: [
          {
            model: Cover_design,
            as: 'coverDesign',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true }
          },
          {
            model: Inner_filling,
            as: 'innerFillings',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true },
            through: { attributes: [] }
          },
          {
            model: Category,
            as: 'categories',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true },
            required: false,
            through: { attributes: [] }
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
      let presets = await Presets.findAll(options)
      let count = await Presets.count({ where: { relevance: true } })
      presets = presets.map(el => el.get({ plain: true }))
      presets = presets.map((preset) => {
        preset.innerFillings = preset.order
          .split(',')
          .map(id => preset.innerFillings.find(innerFilling => innerFilling.id === +id))
        delete preset.order
        return preset
      })
      return res.send({ count: count, rows: presets })
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  postPreset: async function(req, res, next) {
    try {
      //Check cover design id
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      let cover_design = await Cover_design.findOne({
        where: {
          id: req.body.id_cover_design,
          relevance: true
        }
      })
      if (!cover_design) throw new Api404Error(`No such cover design`, { id: req.body.id_cover_design })
      //Check All inner filling ids
      let failedInnerFillingIds = []
      let innerFillingIds = await req.body.id_inner_filling.map(async id => {
        return Inner_filling.findOne({
          where: {
            id: id,
            relevance: true
          }
        })
      })
      let results = await Promise.all(innerFillingIds)
      results.forEach((element, index) => {
        if (!element) failedInnerFillingIds.push(req.body.id_inner_filling[index])
      })
      //Check All category ids
      let failedCategoryIds = []
      let categoryIds = await req.body.id_category.map(async id => {
        return Category.findOne({
          where: {
            id: id,
            relevance: true
          }
        })
      })
      results = await Promise.all(categoryIds)
      results.forEach((element, index) => {
        if (!element) failedCategoryIds.push(req.body.id_category[index])
      })
      //throw failed ids
      if (failedInnerFillingIds.length && failedCategoryIds.length) throw new Api404Error(
        `No inner filling with ids: ${failedInnerFillingIds} No category with ids: ${failedCategoryIds}`,
        {
          failedInnerFillingIds: failedInnerFillingIds, failedCategoryIds: failedCategoryIds
        })
      if (failedInnerFillingIds.length) throw new Api404Error(`No inner filling with id: ${failedInnerFillingIds}`, failedInnerFillingIds)
      if (failedCategoryIds.length) throw new Api404Error(`No category with id: ${failedCategoryIds}`, failedCategoryIds)
      //create preset
      let preset = await Presets.create({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        price: req.body.price,
        id_cover_design: req.body.id_cover_design,
        order: req.body.id_inner_filling.toString()
      })
      //add categories and inner fillings to preset
      await preset.addCategories(req.body.id_category, { through: { selfGranted: false } })
      await preset.addInnerFillings(req.body.id_inner_filling, { through: { selfGranted: false } })
      res.sendStatus(200)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async getPreset(req, res, next) {
    try {
      let preset = await Presets.findOne({
        where: {
          id: req.params['id'],
          relevance: true
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_cover_design', 'id_inner_filling', 'id_category']
        },
        include: [
          {
            model: Cover_design,
            as: 'coverDesign',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true }
          },
          {
            model: Inner_filling,
            as: 'innerFillings',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] },
            where: { relevance: true }
          },
          {
            model: Category,
            as: 'categories',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { relevance: true },
            required: false,
            through: { attributes: [] }
          }
        ]
      })
      if (!preset) throw new Api404Error(`Preset with id:${req.params.id} not found`, { id: req.params.id })
      preset = preset.get({ plain: true })
      let order = preset.order.split(',')
      let ordered = order.map((id, index) => {
        return preset.innerFillings.find((innerFilling) => {
          return innerFilling.id === +id
        })
      })
      preset.innerFillings = ordered
      delete preset.order
      res.send(preset)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  },
  async deletePreset(req, res, next) {
    try {
      let preset = await Presets.findByPk(req.params['id'])
      if (!preset) throw new Api404Error(`Preset with id:${req.params.id} not found`, { id: req.params.id })
      preset = await Presets.update(
        { relevance: false },
        { where: { id: req.params['id'] } })
      res.send()
    } catch (err) {
      next(err)
    }
  },
  async updatePreset(req, res, next) {
    try {
      //Check cover design id
      if (!Object.keys(req.body).length) throw new Api400Error(`Request body is empty`)
      let preset = await Presets.findByPk(req.params.id)
      if (!preset) throw new Api404Error(`Preset with id ${req.params.id} not found`, { id: req.params.id })
      let cover_design = await Cover_design.findOne({
        where: {
          id: req.body.id_cover_design,
          relevance: true
        }
      })
      if (!cover_design) throw new Api404Error(`No such cover design`, { id: req.body.id_cover_design })
      //Check All category ids
      let failedInnerFillingIds = []
      let innerFillingIds = await req.body.id_inner_filling.map(async id => {
        return Inner_filling.findOne({
          where: {
            id: id,
            relevance: true
          }
        })
      })
      let results = await Promise.all(innerFillingIds)
      results.forEach((element, index) => {
        if (!element) failedInnerFillingIds.push(req.body.id_inner_filling[index])
      })
      //Check All inner filling ids
      let failedCategoryIds = []
      let categoryIds = await req.body.id_category.map(async id => {
        return Category.findOne({
          where: {
            id: id,
            relevance: true
          }
        })
      })
      results = await Promise.all(categoryIds)
      results.forEach((element, index) => {
        if (!element) failedCategoryIds.push(req.body.id_category[index])
      })
      //throw failed ids
      if (failedInnerFillingIds.length && failedCategoryIds.length) throw new Api404Error(
        `No inner filling with ids: ${failedInnerFillingIds} No category with ids: ${failedCategoryIds}`,
        {
          failedInnerFillingIds: failedInnerFillingIds, failedCategoryIds: failedCategoryIds
        })
      if (failedInnerFillingIds.length) throw new Api404Error(`No inner filling with id: ${failedInnerFillingIds}`, failedInnerFillingIds)
      if (failedCategoryIds.length) throw new Api404Error(`No category with id: ${failedCategoryIds}`, failedCategoryIds)
      //update relationships
      let oldCategories = await Category_preset.findAll({ where: { PresetId: req.params.id } })
      let oldCategoryIds = oldCategories.map(category => {
        return category.CategoryId
      })
      let oldInnerFillings = await Inner_filling_preset.findAll({ where: { PresetId: req.params.id } })
      let oldInnerFillingIds = oldInnerFillings.map(innerFilling => {
        return innerFilling.InnerFillingId
      })

      let toDeleteCategoryIds = oldCategoryIds.filter(id => !req.body.id_category.includes(id))
      let toAddCategoryIds = req.body.id_category.filter(id => !oldCategoryIds.includes(id))

      let toDeleteInnerFillingIds = oldInnerFillingIds.filter(id => !req.body.id_inner_filling.includes(id))
      let toAddInnerFillingIds = req.body.id_inner_filling.filter(id => !oldInnerFillingIds.includes(id))

      await Category_preset.destroy({ where: { PresetId: req.params.id, CategoryId: toDeleteCategoryIds } })
      await preset.addCategory(toAddCategoryIds, { through: { selfGranted: false } })
      await Inner_filling_preset.destroy({
        where: {
          PresetId: req.params.id,
          InnerFillingId: toDeleteInnerFillingIds
        }
      })
      await preset.addInnerFilling(toAddInnerFillingIds, { through: { selfGranted: false } })

      let result = await Presets.update(
        {
          name: req.body.name || preset.name,
          description: req.body.description || preset.description,
          imageURL: req.body.imageURL || preset.imageURL,
          price: req.body.price || preset.price,
          id_cover_design: req.body.id_cover_design || cover_design.id,
          order: req.body.id_inner_filling.toString()
        },
        { where: { id: req.params.id, relevance: true } })
      res.sendStatus(200)
    } catch (err) {
      console.log(`err:`, err)
      next(err)
    }
  }
}