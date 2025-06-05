const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Post-Service connecté à PostgreSQL.");
  } catch (error) {
    console.error("❌ Impossible de se connecter à PostgreSQL :", error);
  }
})();

module.exports = sequelize;
