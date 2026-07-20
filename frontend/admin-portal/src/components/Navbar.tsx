import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="font-semibold text-slate-100 tracking-tight">
        Digital Banking – Admin Console
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="text-right">
          <div className="text-slate-100 font-medium">Administrator</div>
          <div className="text-slate-400 text-[11px]">
            {admin?.email ?? "admin@example.com"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="banking-button-ghost !px-3 !py-1 text-[11px]"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
