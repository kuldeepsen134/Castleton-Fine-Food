module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define('subscription', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery_frequency: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return Subscription;
  };