// models/product.js

import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

// Определение модели Product
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true
  },
  material: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Product_category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Brands: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // Значение по умолчанию
  },
  add_to_cart: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Настройки модели
  tableName: 'products',
  timestamps: false // Если не используете временные метки createdAt и updatedAt
});

export default Product;
