module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define('addresses', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    address1: {
      type: Sequelize.STRING
    },
    address2: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    province: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    postcode: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['is_primary', 'active', 'in_active']],
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Address;
};