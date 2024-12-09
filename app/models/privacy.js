module.exports = (sequelize, Sequelize) => {
    const Policy = sequelize.define('policy', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        policy_name: {
            type: Sequelize.STRING,
            
        },
        policy_content: {
            type: Sequelize.STRING
        },
        policy_type: {
            type: Sequelize.STRING,
            // allowNull: false // Assuming type should not be null
        },
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return Policy;
};