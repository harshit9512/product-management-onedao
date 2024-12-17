const { User } = require('../models');
const { createResponse } = require('../utils/responseUtils');
const { Op } = require('sequelize');  // Import Sequelize operators

exports.getUsers = async (req, res) => {
  const { page = 1, pageSize = 10, sortBy = 'createdAt', order = 'ASC', filters = {} } = req.body;

  // Validate page and pageSize
  const pageNum = isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);
  const limitNum = isNaN(parseInt(pageSize, 10)) ? 10 : parseInt(pageSize, 10);

  const where = {};

  // Add filters dynamically (for name, email, etc.)
  if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
  if (filters.email) where.email = { [Op.like]: `%${filters.email}%` };

  const validSortFields = ['name', 'email', 'createdAt'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  try {
    const { count, rows } = await User.findAndCountAll({
      where,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [[sortField, order.toUpperCase()]],
    });

    const totalPages = Math.ceil(count / limitNum);

    return res.status(200).json(createResponse(true, "Users retrieved successfully", {
      users: rows,
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        totalUsers: count,
        totalPages: totalPages,
      },
    }));
  } catch (err) {
    console.error('Error fetching users:', err);  // Add more specific error logging
    return res.status(500).json(createResponse(false, "Failed to retrieve users", null, { code: 500, message: err.message }));
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log('Updating User');
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.update(req.body);
      return res.status(200).json(createResponse(true, "User updated successfully", user));
    } else {
      return res.status(404).json(createResponse(false, "User not found", null, { code: 404, message: "User with the given ID does not exist" }));
    }
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to update user", null, { code: 500, message: err.message }));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return res.status(200).json(createResponse(true, "User deleted successfully"));
    } else {
      return res.status(404).json(createResponse(false, "User not found", null, { code: 404, message: "User with the given ID does not exist" }));
    }
  } catch (err) {
    return res.status(500).json(createResponse(false, "Failed to delete user", null, { code: 500, message: err.message }));
  }
};
