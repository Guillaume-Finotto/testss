const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // passer à true pour debug SQL
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Auth-Service connecté à PostgreSQL.");
  } catch (error) {
    console.error("❌ Impossible de se connecter à PostgreSQL :", error);
  }
})();

module.exports = sequelize;
