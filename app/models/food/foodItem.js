module.exports = (sequelize, Sequelize) => {
  const FoodItem = sequelize.define('foodItems', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT('long'),
    },
    short_description: {
      type: Sequelize.TEXT('long'),
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    regular_price: {
      type: Sequelize.INTEGER,
    },
    discounted_price: {
      type: Sequelize.INTEGER,
    },
    cost_per_item: {
      type: Sequelize.INTEGER,
    },
    food_item_type: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['vegetarian', 'non_vegetarian', 'aggeterian']]
      }
    },
    backorders: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['no', 'notify', 'yes']]
      }
    },
    is_jain: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['no', 'yes']]
      }
    },
    stock_status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['instock', 'outofstock']]
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return FoodItem;
};