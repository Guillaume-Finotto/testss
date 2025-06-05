const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);

// sequelize.sync({ alter: true }).then(() => {
//   console.log("✅ Tables synchronisées (User-Service).");
// });

app.listen(PORT, () => {
  console.log(`🚀 User-Service en écoute sur le port ${PORT}`);
});
