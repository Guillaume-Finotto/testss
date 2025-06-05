import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setProfile(response.data.user);
    } catch (err) {
      console.error("Erreur fetchProfile:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts/users/${id}/posts`);
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Erreur fetchPosts:", err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${id}/unfollow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${id}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Erreur handleFollow:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    if (currentUser && currentUser.id !== id) {
      api.get(`/users/${currentUser.id}/following`).then((res) => {
        const list = res.data.following.map((u) => u.id);
        setIsFollowing(list.includes(id));
      });
    }
  }, [id, currentUser]);

  if (!profile) return <div>Chargement du profil…</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <img
          src={profile.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl">{profile.username}</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
        {currentUser.id !== id && (
          <button
            onClick={handleFollow}
            className={`ml-auto px-4 py-2 rounded ${
              isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Abonné·e" : "Suivre"}
          </button>
        )}
      </div>
      <h3 className="text-xl mb-2">Publications</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
