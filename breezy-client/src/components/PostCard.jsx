import { useState } from "react";
import api from "../services/api";
import CommentList from "./CommentList";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/interaction/posts/${post.id}/unlike`);
        setLikeCount((c) => c - 1);
      } else {
        await api.post(`/interaction/posts/${post.id}/like`);
        setLikeCount((c) => c + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Erreur toggleLike:", err);
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white">
      <div className="flex items-center mb-2">
        <img
          src={post.author.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{post.author.username}</span>
      </div>
      <p className="mb-2">{post.content}</p>
      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="Média" className="w-full max-h-64 object-cover mb-2" />
      )}
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <button onClick={toggleLike} className="flex items-center space-x-1 hover:text-blue-500">
          {liked ? "💙" : "🤍"} <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center space-x-1 hover:text-green-500"
        >
          💬 <span>{post.commentCount || 0}</span>
        </button>
      </div>
      {showComments && <CommentList postId={post.id} />}
    </div>
  );
}
