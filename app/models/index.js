const Sequelize = require('sequelize');
const { config } = require('../config/config');
const { database, dbHolst, dbUser,dbPassword } = config

// Establishing connection to the database
const sequelize = new Sequelize(database, dbUser, dbPassword, {
  host: dbHolst,
  dialect: 'mysql',
  operatorsAliases: 0, // Suppressing deprecated operator aliases
  // logging: false,

  hooks: {
    // Define hooks for operations performed on database records
    // beforeDefine: function (columns, model) {
    //   model.tableName = `${process.env.DB_TABLE_PREFIX}` + model.name.plural
    // },
    afterCreate: (record) => {
      // Remove sensitive data after record creation
      delete record.dataValues.password;
    },
    afterUpdate: (record) => {
      // Remove sensitive data after record update
      delete record.dataValues.password;
    },
  },
  define: {
    timestamps: true, // Automatically manage 'createdAt' and 'updatedAt' fields
    freezeTableName: true // Prevent sequelize from pluralizing table names
  },
  pool: {
    // Configuring connection pool options
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Define database models
const db = {
  User: require('./user')(sequelize, Sequelize),
  Address: require('./address')(sequelize, Sequelize),
  Location: require('./location')(sequelize, Sequelize),
  Category: require('./food/category')(sequelize, Sequelize),
  FoodItem: require('./food/foodItem')(sequelize, Sequelize),
  Media: require('./media')(sequelize, Sequelize),
  AddToCart: require('./addToCart')(sequelize, Sequelize),
  WishList: require('./wishList')(sequelize, Sequelize),

  Order: require('./order')(sequelize, Sequelize),
  OrderItem: require('./orderItem')(sequelize, Sequelize),

  Policy: require('./privacy')(sequelize, Sequelize),
  Subscriber: require('./subscriber')(sequelize, Sequelize),
  Subscription: require('./subscription')(sequelize, Sequelize),
  Frequency: require('./frequency')(sequelize, Sequelize),
};

// Define associations between models
// For more information, refer to Sequelize documentation: https://sequelize.org/docs/v6/core-concepts/assocs

// User-Address association
db.User.hasOne(db.Address, { foreignKey: { name: 'user_id', allowNull: false } });
db.Address.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });

// Category-FoodItem association
db.Category.hasOne(db.FoodItem, { foreignKey: { name: 'category_id', allowNull: false } });
db.FoodItem.belongsTo(db.Category, { foreignKey: { name: 'category_id', allowNull: false } });

// FoodItem-Media association
db.FoodItem.hasOne(db.Media, { foreignKey: { name: 'food_item_id', allowNull: false } });
db.Media.belongsTo(db.FoodItem, { foreignKey: { name: 'food_item_id', allowNull: false } });

// User-AddToCart association
db.User.hasOne(db.AddToCart, { foreignKey: { name: 'user_id', allowNull: false } });
db.AddToCart.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });

// FoodItem-AddToCart association
db.FoodItem.hasOne(db.AddToCart, { foreignKey: { name: 'food_item_id', allowNull: false } });
db.AddToCart.belongsTo(db.FoodItem, { foreignKey: { name: 'food_item_id', allowNull: false } });

// AddToCart-OrderItem association
db.AddToCart.hasOne(db.OrderItem, { foreignKey: { name: 'cart_id', allowNull: false } });
db.OrderItem.belongsTo(db.AddToCart, { foreignKey: { name: 'cart_id', allowNull: false } });

// User-Order association
db.User.hasOne(db.Order, { foreignKey: { name: 'user_id', allowNull: false } });
db.Order.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });

// Address-Order association
db.Address.hasOne(db.Order, { foreignKey: { name: 'address_id', allowNull: false } });
db.Order.belongsTo(db.Address, { foreignKey: { name: 'address_id', allowNull: false } });

// User-OrderItem association
db.User.hasOne(db.OrderItem, { foreignKey: { name: 'user_id', allowNull: false } });
db.OrderItem.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });

// Order-OrderItem association
db.Order.hasOne(db.OrderItem, { foreignKey: { name: 'order_id', allowNull: false } });
db.OrderItem.belongsTo(db.Order, { foreignKey: { name: 'order_id', allowNull: false } });





// User-AddToCart association
db.User.hasOne(db.WishList, { foreignKey: { name: 'user_id', allowNull: false } });
db.WishList.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });

// FoodItem-WishList association
db.FoodItem.hasOne(db.WishList, { foreignKey: { name: 'food_item_id', allowNull: false } });
db.WishList.belongsTo(db.FoodItem, { foreignKey: { name: 'food_item_id', allowNull: false } });



// User-Frequency association
db.User.hasOne(db.Frequency, { foreignKey: { name: 'user_id', allowNull: false } });
db.Frequency.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } });


// Frequency-Subscription association
db.Subscription.hasOne(db.Frequency, { foreignKey: { name: 'subscription_id', allowNull: false } });
db.Frequency.belongsTo(db.Subscription, { foreignKey: { name: 'subscription_id', allowNull: false } });


// Frequency-Subscription association
db.Order.hasOne(db.Frequency, { foreignKey: { name: 'order_id', allowNull: false } });
db.Frequency.belongsTo(db.Order, { foreignKey: { name: 'order_id', allowNull: false } });





// Export the database models
module.exports = db;

// Syncing the database to ensure schema changes are reflected
sequelize.sync({ alter: true, }).then(() => console.log('Yes re-sync'))

