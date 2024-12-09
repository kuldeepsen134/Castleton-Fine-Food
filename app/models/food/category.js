module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('category', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT('long')	
      },
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return Category;
  };