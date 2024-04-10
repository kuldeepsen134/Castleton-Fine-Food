module.exports = (sequelize, Sequelize) => {
    const AddToCart = sequelize.define('add_to_cart', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      quantity: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return AddToCart;
  };