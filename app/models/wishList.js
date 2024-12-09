module.exports = (sequelize, Sequelize) => {
    const WishList = sequelize.define('wish_list', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      // quantity: {
      //   type: Sequelize.INTEGER
      // },
      // price: {
      //   type: Sequelize.FLOAT
      // },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return WishList;
  };