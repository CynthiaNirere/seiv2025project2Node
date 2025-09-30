require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: ["http://localhost:5176", "http://localhost:5173", "http://localhost:8080", "http://localhost:8081"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set up database 
const db = require("./app/models");

// for not to recreate each time database but add new things
db.sequelize.sync({ alter: false })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch(err => {
    console.error("Failed to sync database:", err);
  });

// for devel to recreate each time database 
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Courses application." });
});

// course routes only
require("./app/routes/courses")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});