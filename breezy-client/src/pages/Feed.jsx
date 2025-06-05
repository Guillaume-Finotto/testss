import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/feed?userId=${user.id}&limit=20&page=1`);
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Erreur fetchFeed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl mb-4">Fil d’actualité</h1>
      {loading ? (
        <div>Chargement…</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
