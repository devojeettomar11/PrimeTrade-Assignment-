import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">
        PrimeTrade <span className="text-blue-400">Assignment</span>
      </h1>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <p className="hidden sm:block text-sm text-gray-200">
              {user.name} ({user.role})
            </p>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-blue-400" to="/login">
              Login
            </Link>
            <Link className="hover:text-blue-400" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
