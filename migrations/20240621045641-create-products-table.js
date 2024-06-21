
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable(
		'Products',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title_uz: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			title_ru: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			img: {
				type: DataTypes.STRING,
				allowNull: true,
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
				allowNull: true,
			},
			description_ru: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.INTEGER,
				allowNull: false,
				get() {
					return this.getDataValue('createdAt');
				},
			},
			updatedAt: {
				type: DataTypes.INTEGER,
				allowNull: false,
				get() {
					return this.getDataValue('updatedAt');
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
}

export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable('Products');
}
