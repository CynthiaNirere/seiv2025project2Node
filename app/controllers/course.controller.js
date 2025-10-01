const db = require("../models");
const Course = db.courses;
const Op = db.Sequelize.Op;

// Create and Save a new Course
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Dept || !req.body.Course_Number || !req.body.Name) {
    res.status(400).send({
      message: "Dept, Course_Number, and Name are required!"
    });
    return;
  }

  // Create a Course
  const course = {
    Dept: req.body.Dept,
    Course_Number: req.body.Course_Number,
    Level: req.body.Level,
    Hours: req.body.Hours,
    Name: req.body.Name,
    Description: req.body.Description
  };

  // Save Course in the database
  Course.create(course)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Course."
      });
    });
};

// Retrieve all Courses from the database
exports.findAll = (req, res) => {
  Course.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving courses."
      });
    });
};

// Find a single Course by its Course_Number (primary key)
exports.findOne = (req, res) => {
  const courseNumber = req.params.id; // route param retained as :id for compatibility

  Course.findByPk(courseNumber)
    .then(data => {
      if (data) return res.send(data);
      return res.status(404).send({ message: `Cannot find Course with Course_Number=${courseNumber}.` });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error retrieving Course with Course_Number=' + courseNumber, detail: err.message });
    });
};

// Update a Course by its Course_Number
exports.update = (req, res) => {
  const courseNumber = req.params.id;

  Course.update(req.body, { where: { Course_Number: courseNumber } })
    .then(([count]) => {
      if (count === 1) return res.send({ message: 'Course updated successfully.' });
      return res.status(404).send({ message: `Course with Course_Number=${courseNumber} not found or no changes.` });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error updating Course with Course_Number=' + courseNumber, detail: err.message });
    });
};

// Delete a Course with the specified Course_Number in the request
exports.delete = (req, res) => {
  const courseNumber = req.params.id;

  Course.destroy({ where: { Course_Number: courseNumber } })
    .then(count => {
      if (count === 1) return res.send({ message: 'Course deleted successfully.' });
      return res.status(404).send({ message: `Cannot delete. Course with Course_Number=${courseNumber} not found.` });
    })
    .catch(err => {
      res.status(500).send({ message: 'Could not delete Course with Course_Number=' + courseNumber, detail: err.message });
    });
};

// Delete all Courses from the database
exports.deleteAll = (req, res) => {
  Course.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Courses were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all courses."
      });
    });
};