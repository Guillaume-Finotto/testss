import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const { user, signout } = useAuth();
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
      setLanguage(user.language || "en");
      setTheme(user.theme || "light");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const updated = { bio, avatar_url: avatarUrl, language, theme };
      const response = await api.put(`/users/${user.id}`, updated);
      setMessage("Profil mis à jour !");
      localStorage.setItem("breezy_user", JSON.stringify(response.data.user));
    } catch (err) {
      console.error("Erreur updateSettings:", err);
      setMessage("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Paramètres du compte</h1>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Bio</label>
        <textarea
          className="w-full border p-2 rounded mb-3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label className="block mb-1">URL de l’avatar</label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-3"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <label className="block mb-1">Langue</label>
        <select
          className="w-full border p-2 rounded mb-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">anglais</option>
          <option value="fr">français</option>
          <option value="es">espagnol</option>
        </select>
        <label className="block mb-1">Thème</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-4">
          Enregistrer
        </button>
      </form>
      <button onClick={signout} className="w-full bg-red-500 text-white p-2 rounded">
        Se déconnecter
      </button>
    </div>
  );
}
