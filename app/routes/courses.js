// app/routes/courses.js
module.exports = (app) => {
  const express = require('express');
  const router = express.Router();

  const controller = require('../controllers/course.controller.js');

  router.post('/', controller.create);
  router.get('/', controller.findAll);
  router.get('/:courseNumber', controller.findOne);
  router.put('/:courseNumber', controller.update);
  router.delete('/:courseNumber', controller.delete);
  router.delete('/', controller.deleteAll);

  app.use('/course-t1/courses', router);
};
