import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, signout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex items-center">
      <Link to="/feed" className="text-xl font-bold">
        Breezy
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} className="hover:underline">
              {user.username}
            </Link>
            <Link to="/settings" className="hover:underline">
              ⚙️
            </Link>
            <button onClick={signout} className="text-red-500 hover:underline">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Connexion
            </Link>
            <Link to="/signup" className="hover:underline">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
