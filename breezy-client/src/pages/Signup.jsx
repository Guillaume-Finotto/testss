import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, username, password);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl mb-4 text-center">Inscription</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mb-1">Nom d’utilisateur</label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="block mb-1">Mot de passe</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          S’inscrire
        </button>
        <p className="mt-4 text-center text-sm">
          Déjà un compte ?{" "}
          <a href="/login" className="text-green-500">
            Connexion
          </a>
        </p>
      </form>
    </div>
  );
}
