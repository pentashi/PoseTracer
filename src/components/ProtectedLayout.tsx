import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navigation from "./Navigation";

const ProtectedLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState(() => {
    const path = location.pathname.replace("/", "") || "dashboard";
    return path;
  });

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative pb-24">
      {/* Page Content */}
      <Outlet />

      {/* Fixed Navigation */}
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
    </div>
  );
};

export default ProtectedLayout;
