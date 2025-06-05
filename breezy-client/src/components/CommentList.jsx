import { useEffect, useState } from "react";
import api from "../services/api";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    try {
      const response = await api.get(`/interaction/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (err) {
      console.error("Erreur fetchComments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      await api.post(`/interaction/posts/${postId}/comments`, { content });
      setContent("");
      fetchComments();
    } catch (err) {
      console.error("Erreur addComment:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="bg-gray-100 p-2 rounded">
      {comments.map((c) => (
        <div key={c.id} className="border-b py-2">
          <div className="flex items-center mb-1">
            <img
              src={c.Author.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="font-semibold">{c.Author.username}</span>
          </div>
          <p>{c.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          className="w-full border p-2 rounded mb-2"
          rows="2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un commentaire..."
        ></textarea>
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
}
