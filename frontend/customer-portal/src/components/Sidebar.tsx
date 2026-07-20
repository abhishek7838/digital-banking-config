import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-badge">DB</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">Digital Bank</span>
          <span className="sidebar-logo-sub">Customer Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="sidebar-link-icon">🏦</div>
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-section-label">Accounts</div>
        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="sidebar-link-icon">💳</div>
          <span>My Accounts</span>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="sidebar-link-icon">📜</div>
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to="/transfer"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="sidebar-link-icon">🔁</div>
          <span>Funds Transfer</span>
        </NavLink>

        <div className="sidebar-section-label">Profile</div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="sidebar-link-icon">👤</div>
          <span>Profile & Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        © {new Date().getFullYear()} Digital Banking System
      </div>
    </aside>
  );
};

export default Sidebar;
