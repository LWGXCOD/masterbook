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
const setUpAssociations = require('../models/setUpAssociations')

function initializeDbModels(sequelize) {
    Cover_design.initialize(sequelize)
    Inner_filling.initialize(sequelize)
    Presets.initialize(sequelize)
    Category.initialize(sequelize)
    Category_preset.initialize(sequelize)
    Inner_filling_preset.initialize(sequelize)
    Cart.initialize(sequelize)
    Address.initialize(sequelize)
    Personal_data.initialize(sequelize)
    Order.initialize(sequelize)
    Order_cart.initialize(sequelize)
    Order_personal_data.initialize(sequelize)
    Order_address.initialize(sequelize)

    setUpAssociations()
}

async function syncDbTables() {
    await Cover_design.sync({alter: true})
    await Inner_filling.sync({alter: true})
    await Presets.sync({alter: true})
    await Category.sync({alter: true})
    await Category_preset.sync({alter: true})
    await Inner_filling_preset.sync({alter: true})
    await Cart.sync({alter: true})
    await Address.sync({alter:true})
    await Personal_data.sync({alter:true})
    await Order.sync({alter:true})
    await Order_cart.sync({alter:true})
    await Order_personal_data.sync({alter:true})
    await Order_address.sync({alter:true})
}

module.exports = {
    initializeDbModels,
    syncDbTables
}