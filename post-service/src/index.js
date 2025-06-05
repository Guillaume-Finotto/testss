const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const postRoutes = require("./routes/posts");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(bodyParser.json());

app.use("/posts", postRoutes);

// sequelize.sync({ alter: true }).then(() => {
//   console.log("✅ Tables synchronisées (Post-Service).");
// });

app.listen(PORT, () => {
  console.log(`🚀 Post-Service en écoute sur le port ${PORT}`);
});
