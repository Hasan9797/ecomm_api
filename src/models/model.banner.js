import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.db.js';

class Banner extends Model {
	static associate(models) {}
}

Banner.init(
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
		modelName: 'Banner',
		timestamps: true,
		createdAt: 'created_at', // Rename createdAt to created_at
		updatedAt: 'updated_at', // Rename updatedAt to updated_at
		hooks: {
			beforeCreate(banner) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				banner.created_at = currentTimestamp;
				banner.updated_at = currentTimestamp;
			},
			beforeUpdate(banner) {
				banner.updated_at = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Banner;
