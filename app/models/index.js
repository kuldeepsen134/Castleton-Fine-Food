const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  operatorsAliases: 0,
  hooks: {
    // beforeDefine: function (columns, model) {
    //   model.tableName = `${process.env.DB_TABLE_PREFIX}` + model.name.plural
    // },
    afterCreate: (record) => {
      delete record.dataValues.password
    },
    afterUpdate: (record) => {
      delete record.dataValues.password
    },
  },
  define: {
    timestamps: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const db = {
  User: require('./user')(sequelize, Sequelize),
  Address: require('./address')(sequelize, Sequelize),
  Location: require('./location')(sequelize, Sequelize),
  Category: require('./food/category')(sequelize, Sequelize),
  FoodItem: require('./food/foodItem')(sequelize, Sequelize),
  Media: require('./media')(sequelize, Sequelize),
  AddToCart: require('./addToCart')(sequelize, Sequelize),
  Order: require('./order')(sequelize, Sequelize),
  OrderItem: require('./orderItem')(sequelize, Sequelize),



}

/**
 * Association
 * @link https://sequelize.org/docs/v6/core-concepts/assocs
 */

db.User.hasOne(db.Address, { foreignKey: { name: 'user_id', allowNull: false } })
db.Address.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } })


db.Category.hasOne(db.FoodItem, { foreignKey: { name: 'category_id', allowNull: false } })
db.FoodItem.belongsTo(db.Category, { foreignKey: { name: 'category_id', allowNull: false } })

db.FoodItem.hasOne(db.Media, { foreignKey: { name: 'food_item_id', allowNull: false } })
db.Media.belongsTo(db.FoodItem, { foreignKey: { name: 'food_item_id', allowNull: false } })


db.User.hasOne(db.AddToCart, { foreignKey: { name: 'user_id', allowNull: false } })
db.AddToCart.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } })


db.FoodItem.hasOne(db.AddToCart, { foreignKey: { name: 'food_item_id', allowNull: false } })
db.AddToCart.belongsTo(db.FoodItem, { foreignKey: { name: 'food_item_id', allowNull: false } })

db.AddToCart.hasOne(db.Order, { foreignKey: { name: 'cart_id', allowNull: false } })
db.Order.belongsTo(db.AddToCart, { foreignKey: { name: 'cart_id', allowNull: false } })

db.User.hasOne(db.Order, { foreignKey: { name: 'user_id', allowNull: false } })
db.Order.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } })

db.Address.hasOne(db.Order, { foreignKey: { name: 'address_id', allowNull: false } })
db.Order.belongsTo(db.Address, { foreignKey: { name: 'address_id', allowNull: false } })




db.User.hasOne(db.OrderItem, { foreignKey: { name: 'user_id', allowNull: false } })
db.OrderItem.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } })


db.Order.hasOne(db.OrderItem, { foreignKey: { name: 'order_id', allowNull: false } })
db.OrderItem.belongsTo(db.Order, { foreignKey: { name: 'order_id', allowNull: false } })



module.exports = db;

sequelize.sync({ alter: true, }).then(() => console.log('Yes re-sync'))