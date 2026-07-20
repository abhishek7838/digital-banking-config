import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  const location = useLocation();

  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard Overview",
    "/accounts": "My Accounts",
    "/transactions": "Transaction History",
    "/transfer": "Funds Transfer",
    "/profile": "Profile & Security"
  };

  const subtitleMap: Record<string, string> = {
    "/dashboard": "Snapshot of your balances, spends and insights",
    "/accounts": "View balances, account numbers and account details",
    "/transactions": "Track all debits and credits in real time",
    "/transfer": "Transfer securely to your accounts and beneficiaries",
    "/profile": "Manage personal details, contact info and security"
  };

  const path = location.pathname as keyof typeof titleMap;
  const title = titleMap[path] || "Customer Portal";
  const subtitle =
    subtitleMap[path] || "Secure digital banking for your everyday needs";

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-layout">
        <Navbar title={title} subtitle={subtitle} />
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
