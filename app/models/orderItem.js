module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('order_item', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
    },
      { 
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return OrderItem;
  };