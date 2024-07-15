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

module.exports = {
  getAllUnits,
  getUnitById,
  addUnit,
  updateUnit,
  deleteUnit,
};
