/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Products",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title_uz: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title_ru: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        img: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        gallery: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          defaultValue: productEnum.STATUS_CREATE,
          allowNull: false,
        },
        characteristic: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        description_uz: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        description_ru: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.INTEGER,
          allowNull: false,
          get() {
            return this.getDataValue("createdAt");
          },
        },
        updatedAt: {
          type: DataTypes.INTEGER,
          allowNull: false,
          get() {
            return this.getDataValue("updatedAt");
          },
        },
      },
      {
        timestamps: true,
        hooks: {
          beforeCreate(order) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            order.createdAt = currentTimestamp;
            order.updatedAt = currentTimestamp;
          },
          beforeUpdate(order) {
            order.updatedAt = Math.floor(Date.now() / 1000);
          },
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
