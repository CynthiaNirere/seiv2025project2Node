// app/controllers/course.controller.js
const db = require('../models');
const Course = db.courses;

// Create
async function create(req, res) {
  try {
    const required = ['Dept', 'Course_Number', 'Name'];
    for (const f of required) {
      if (!req.body[f]) return res.status(400).json({ message: `${f} is required` });
    }

    // normalize (optional)
    req.body.Dept = (req.body.Dept || '').trim().toUpperCase();
    req.body.Course_Number = (req.body.Course_Number || '').trim().toUpperCase();

    const created = await Course.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    // duplicate PK / unique
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Course number already exists' });
    }
    res.status(500).json({ message: 'Failed to create course' });
  }
}

// Find all
async function findAll(_req, res) {
  try {
    const items = await Course.findAll({ order: [['Course_Number', 'ASC']] });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
}

// Find one
async function findOne(req, res) {
  try {
    const item = await Course.findOne({ where: { Course_Number: req.params.courseNumber } });
    if (!item) return res.status(404).json({ message: 'Course not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
}

// Update
async function update(req, res) {
  try {
    // prevent PK change
    if (req.body.Course_Number && req.body.Course_Number !== req.params.courseNumber) {
      return res.status(400).json({ message: 'Course_Number cannot be changed' });
    }
    const [count] = await Course.update(req.body, { where: { Course_Number: req.params.courseNumber } });
    if (!count) return res.status(404).json({ message: 'Course not found' });
    const updated = await Course.findOne({ where: { Course_Number: req.params.courseNumber } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update course' });
  }
}

// Delete by Course_Number
async function remove(req, res) {
  try {
    const count = await Course.destroy({ where: { Course_Number: req.params.courseNumber } });
    if (!count) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete course' });
  }
}

// Delete all
async function deleteAll(_req, res) {
  try {
    const count = await Course.destroy({ where: {} });
    res.json({ message: `Deleted ${count} courses` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete all courses' });
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  delete: remove,   // export with  'delete'
  deleteAll,
};
