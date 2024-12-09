module.exports = (sequelize, Sequelize) => {
    const Frequency = sequelize.define('frequency', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['deactive', 'active']],
          }
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return Frequency;
  };