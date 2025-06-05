const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../../user-service/src/models/User");
const Post = require("../../post-service/src/models/Post");

class Like extends Model {}

Like.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Post, key: "id" },
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "likes",
    underscored: true,
    timestamps: false,
    modelName: "Like",
  }
);

module.exports = Like;
