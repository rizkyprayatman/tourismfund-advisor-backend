const { Unit } = require('../models');

const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found.' });
    }
    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const addUnit = async (req, res) => {
  const { nama, deskripsi, pic, no_telepon_pic, email_pic } = req.body;
  try {
    const newUnit = await Unit.create({
      nama,
      deskripsi,
      pic,
      no_telepon_pic,
      email_pic,
    });
    res.status(201).json(newUnit);
  } catch (error) {
    console.error('Error adding unit:', error);
    res.status(500).json({ message: 'Failed to add unit.' });
  }
};

const updateUnit = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, pic, no_telepon_pic, email_pic } = req.body;
  try {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found.' });
    }
    await unit.update({
      nama,
      deskripsi,
      pic,
      no_telepon_pic,
      email_pic,
    });
    res.json(unit);
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ message: 'Failed to update unit.' });
  }
};

const deleteUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found.' });
    }
    await unit.destroy();
    res.json({ message: 'Unit deleted successfully.' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ message: 'Failed to delete unit.' });
  }
};

const getAllUnitPagination = async (req, res) => {
  const { page = 1, perPage = 5, sort = 'createdAt', order = 'desc', search = '' } = req.query;

  try {
    const offset = (page - 1) * perPage;
    const limit = parseInt(perPage, 10);

    const where = search
      ? {
        [Op.or]: [
          { nama: { [Op.like]: `%${search}%` } },
          { deskripsi: { [Op.like]: `%${search}%` } },
          { pic: { [Op.like]: `%${search}%` } },
          { no_telepon_pic: { [Op.like]: `%${search}%` } },
          { email_pic: { [Op.like]: `%${search}%` } },
        ],
      }
      : {};

    const units = await Unit.findAndCountAll({
      where,
      order: [[sort, order.toUpperCase()]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(units.count / perPage);

    res.json({
      units: units.rows,
      pagination: {
        lastPage: totalPages,
        order: order.toUpperCase(),
        page: parseInt(page, 10),
        perPage: limit,
        search,
        sort,
        total: units.count,
      },
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getAllUnits,
  getUnitById,
  addUnit,
  updateUnit,
  deleteUnit,
  getAllUnitPagination
};
