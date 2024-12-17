const { Product } = require('../models');
const { createResponse } = require('../utils/responseUtils');
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(createResponse(true, "Product created successfully", product));
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to create product", null, { code: 500, message: err.message }));
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', order = 'ASC', filters = {} } = req.body;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(pageSize, 10);

    let filterConditions = {};

    if (filters.name) {
      filterConditions.name = {
        [Op.like]: `%${filters.name}%`, // Fuzzy search for product name
      };
    }
    if (filters.priceMin || filters.priceMax) {
      filterConditions.price = {};
      if (filters.priceMin) {
        filterConditions.price[Op.gte] = filters.priceMin; 
      }
      if (filters.priceMax) {
        filterConditions.price[Op.lte] = filters.priceMax;
      }
    }

    const products = await Product.findAndCountAll({
      where: filterConditions,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [[sortBy, order]],
    });

    return res.status(200).json(createResponse(true, "Products retrieved successfully", {
      products: products.rows,
      totalCount: products.count,
      page: pageNum,
      totalPages: Math.ceil(products.count / limitNum),
    }));
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to retrieve products", null, { code: 500, message: err.message }));
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.update(req.body);
      return res.status(200).json(createResponse(true, "Product updated successfully", product));
    } else {
      return res.status(404).json(createResponse(false, "Product not found", null, { code: 404, message: "Product with the given ID does not exist" }));
    }
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to update product", null, { code: 500, message: err.message }));
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      return res.status(200).json(createResponse(true, "Product deleted successfully"));
    } else {
      return res.status(404).json(createResponse(false, "Product not found", null, { code: 404, message: "Product with the given ID does not exist" }));
    }
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to delete product", null, { code: 500, message: err.message }));
  }
};
