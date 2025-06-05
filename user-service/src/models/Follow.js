const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

class Follow extends Model {}

Follow.init(
  {
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "follows",
    underscored: true,
    modelName: "Follow",
    timestamps: false,
  }
);

User.belongsToMany(User, {
  as: "Followers",
  through: Follow,
  foreignKey: "following_id",
  otherKey: "follower_id",
});

User.belongsToMany(User, {
  as: "Following",
  through: Follow,
  foreignKey: "follower_id",
  otherKey: "following_id",
});

module.exports = Follow;
