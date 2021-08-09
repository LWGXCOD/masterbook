const Cover_design = require('../models/cover_design')
const Inner_filling = require('../models/inner_filling')
const Presets = require('../models/presets')
const Category = require('../models/category')
const Category_preset = require('../models/category_preset')
const Inner_filling_preset = require('../models/inner_filling_preset')
const Cart = require('../models/cart')
const Order = require('../models/order')
const Order_cart = require('../models/order_cart')
const Personal_data = require('../models/personal_data')
const Address = require('../models/address')
const Order_address = require('../models/order-address')
const Order_personal_data = require('../models/order-personal_data')

module.exports = () => {
  Presets.belongsTo(Cover_design, { as: 'coverDesign', foreignKey: 'id_cover_design' })
  Cover_design.hasMany(Presets, { as: 'presets', foreignKey: 'id_cover_design' })

  Presets.belongsToMany(Inner_filling, { as: 'innerFillings', through: Inner_filling_preset })
  Inner_filling.belongsToMany(Presets, { as: 'presets', through: Inner_filling_preset })

  Presets.belongsToMany(Category, { as: 'categories', through: Category_preset })
  Category.belongsToMany(Presets, { as: 'presets', through: Category_preset })

  Cart.belongsTo(Presets, { foreignKey: 'id_preset' })
  Presets.hasMany(Cart, { foreignKey: 'id_preset' })

  Order.belongsToMany(Cart,{as: 'cart', through: Order_cart})
  Cart.belongsToMany(Order, {as:'order',through: Order_cart})

  Order.belongsToMany(Address, {as:'address',through: Order_address})
  Address.belongsToMany(Order, {as:'order', through: Order_address})

  Order.belongsToMany(Personal_data, {as:'personalData',through: Order_personal_data})
  Personal_data.belongsToMany(Order, {as:'order', through: Order_personal_data})
}
