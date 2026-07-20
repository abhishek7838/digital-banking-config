import React from "react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  title = "Welcome back",
  subtitle = "Secure Digital Banking · Customer Portal"
}) => {
  const { user, logout } = useAuth();
  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "CU";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">{title}</div>
        <div className="navbar-subtitle">{subtitle}</div>
      </div>

      <div className="navbar-right">
        <div className="navbar-chip">Netbanking · Live</div>

        <button className="btn-ghost" onClick={logout}>
          <span>Logout</span>
        </button>

        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.fullName || "Customer User"}
            </span>
            <span className="navbar-user-role">
              Customer · {user?.customerId || "ID-XXXXXX"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
