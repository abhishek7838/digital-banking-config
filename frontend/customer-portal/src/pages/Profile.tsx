import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Profile & Security</div>
          <div className="card-subtitle">
            View your profile details. Later we will wire this to user-service
            APIs.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div
          style={{
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8
          }}
        >
          <div className="navbar-avatar" style={{ width: 60, height: 60 }}>
            {user?.fullName
              ?.split(" ")
              .map((p) => p[0])
              .join("")
              .toUpperCase() || "CU"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {user?.fullName || "Customer User"}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Customer ID: {user?.customerId || "ID-XXXXXX"}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="form-field">
            <label className="form-label">Registered email</label>
            <input
              className="form-input"
              disabled
              value={user?.email || "you@example.com"}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Mobile number</label>
            <input
              className="form-input"
              disabled
              value="+91-XXXXXXXXXX"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Login preference</label>
            <input
              className="form-input"
              disabled
              value="Username + Password (JWT via API Gateway)"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
