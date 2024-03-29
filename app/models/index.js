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
  Address:require('./address')(sequelize, Sequelize),
  Location:require('./location')(sequelize, Sequelize),
  Category:require('./food/category')(sequelize, Sequelize),
  FoodItem:require('./food/foodItem')(sequelize, Sequelize),
  Media:require('./media')(sequelize, Sequelize),

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

module.exports = db

sequelize.sync({ alter: true, }).then(() => {
  console.log('Yes re-sync')
})