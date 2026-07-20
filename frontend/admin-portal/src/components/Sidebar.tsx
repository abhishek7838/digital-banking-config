// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const menu = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/users", label: "Users" },
  { path: "/kyc-requests", label: "KYC Requests" },
  { path: "/accounts", label: "Accounts" },
  { path: "/transactions", label: "Transactions" },
  { path: "/settings", label: "Settings" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 h-full border-r border-slate-800 bg-slate-950/95">
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Admin Navigation
        </div>
      </div>

      <nav className="mt-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm transition ${
                isActive
                  ? "bg-slate-900 text-banking-accent font-medium border-l-2 border-banking-accent"
                  : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
