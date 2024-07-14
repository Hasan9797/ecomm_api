import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.db.js';

class Brand extends Model {
	static associate(models) {}
}

Brand.init(
	{
		name_uz: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name_ru: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		created_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('created_at');
			},
		},
		updated_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('updated_at');
			},
		},
	},
	{
		sequelize,
		modelName: 'Brand',
		timestamps: true,
		createdAt: 'created_at', // Rename createdAt to created_at
		updatedAt: 'updated_at', // Rename updatedAt to updated_at
		hooks: {
			beforeCreate(brand) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				brand.created_at = currentTimestamp;
				brand.updated_at = currentTimestamp;
			},
			beforeUpdate(brand) {
				brand.updated_at = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Brand;
