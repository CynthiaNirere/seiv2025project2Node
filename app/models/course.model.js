module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("Course", {
    Course_Number: {
      type: Sequelize.STRING(45),
      primaryKey: true,
      allowNull: false,
      field: 'Course_Number'
    },
    Dept: {
      type: Sequelize.STRING(25),
      allowNull: false
    },
    Level: {
      type: Sequelize.INTEGER(11)
    },
    Hours: {
      type: Sequelize.INTEGER(11)
    },
    Name: {
      type: Sequelize.STRING(45)
    },
    Description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'courses',
    timestamps: false,
    freezeTableName: true
  });

  return Course;
};