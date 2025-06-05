const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../../user-service/src/models/User");

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    type: {
      type: DataTypes.ENUM("mention", "like", "follow", "comment"),
      allowNull: false,
    },
    source_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    underscored: true,
    timestamps: false,
    modelName: "Notification",
  }
);

Notification.belongsTo(User, { as: "Recipient", foreignKey: "user_id" });

module.exports = Notification;
