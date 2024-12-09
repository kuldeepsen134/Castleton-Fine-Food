module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define('locations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
         unique: true
      },
      type: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['warehouse', 'outlet']]
        }
      },
      address: {
        type: Sequelize.STRING
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return Location;
  };