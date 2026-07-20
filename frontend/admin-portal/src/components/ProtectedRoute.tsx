// ✅ src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { admin, initializing } = useAuth();
  const location = useLocation();

  // ✅ do NOT redirect until localStorage hydration is done
  if (initializing) {
    return (
      <div className="p-6 text-slate-300 text-sm">
        Loading session...
      </div>
    );
  }

  if (!admin?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
