import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.db.js';

class Category extends Model {
	static associate(models) {
		// Category modelida hasMany aloqasi
		this.hasMany(models.Product, {
			foreignKey: 'category_id',
			as: 'product',
		});

		this.belongsTo(models.Category, {
			foreignKey: 'parentId',
			as: 'parent',
		});

		this.hasMany(models.Category, {
			foreignKey: 'parentId',
			as: 'subcategories',
		});
	}
}

Category.init(
	{
		title_uz: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title_ru: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		parent_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'categories', // foreign key bo'lgan jadval nomi
				key: 'id',
			},
		},
		created_at: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('created_at');
			},
		},
		updated_at: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('updated_at');
			},
		},
	},
	{
		sequelize,
		modelName: 'Category',
		timestamps: true,
		createdAt: 'created_at', // Rename createdAt to created_at
		updatedAt: 'updated_at', // Rename updatedAt to updated_at
		hooks: {
			beforeCreate(category) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				category.created_at = currentTimestamp;
				category.updated_at = currentTimestamp;
			},
			beforeUpdate(category) {
				category.updated_at = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Category;
