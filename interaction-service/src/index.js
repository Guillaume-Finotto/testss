const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const interactionRoutes = require("./routes/interaction");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(bodyParser.json());

app.use("/interaction", interactionRoutes);

// sequelize.sync({ alter: true }).then(() => {
//   console.log("✅ Tables synchronisées (Interaction-Service).");
// });

app.listen(PORT, () => {
  console.log(`🚀 Interaction-Service en écoute sur le port ${PORT}`);
});
