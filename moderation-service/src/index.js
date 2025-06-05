const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const moderationRoutes = require("./routes/moderation");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(bodyParser.json());

app.use("/moderation", moderationRoutes);

// sequelize.sync({ alter: true }).then(() => {
//   console.log("✅ Tables synchronisées (Moderation-Service).");
// });

app.listen(PORT, () => {
  console.log(`🚀 Moderation-Service en écoute sur le port ${PORT}`);
});
