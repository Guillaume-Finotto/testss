import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signin(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl mb-4 text-center">Connexion</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Se connecter
        </button>
        <p className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <a href="/signup" className="text-blue-500">
            Inscription
          </a>
        </p>
      </form>
    </div>
  );
}
