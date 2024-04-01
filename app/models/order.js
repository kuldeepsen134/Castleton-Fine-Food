module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('order', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      total: {
        type: Sequelize.INTEGER
      },
      sub_total: {
        type: Sequelize.INTEGER
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return Order;
  };