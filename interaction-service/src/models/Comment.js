const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../../user-service/src/models/User");
const Post = require("../../post-service/src/models/Post");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Post, key: "id" },
    },
    parent_comment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "comments", key: "id" },
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "comments",
    underscored: true,
    timestamps: false,
    modelName: "Comment",
  }
);

Comment.belongsTo(User, { as: "Author", foreignKey: "author_id" });
Comment.belongsTo(Comment, { as: "Parent", foreignKey: "parent_comment_id" });
Comment.hasMany(Comment, { as: "Replies", foreignKey: "parent_comment_id" });

module.exports = Comment;
