const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);

// sequelize.sync({ alter: true }).then(() => {
//   console.log("✅ Tables synchronisées (Auth-Service).");
// });

app.listen(PORT, () => {
  console.log(`🚀 Auth-Service en écoute sur le port ${PORT}`);
});
