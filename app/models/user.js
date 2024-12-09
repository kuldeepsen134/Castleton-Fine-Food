
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: { args: true, msg: 'Mobile number is already taken. Please choose another one.' },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { args: true, msg: 'Account already exists with your email.' },
        validate: {
          isEmail: true
        }
      },
      status: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['pending', 'active', 'suspended', 'deleted']],
        }
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['administrator', 'super_admin', 'outlet_manager', 'salesman', 'customer']],
        }
      },
      token: {
        type: Sequelize.UUID
      }
    },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
    return User;
  };