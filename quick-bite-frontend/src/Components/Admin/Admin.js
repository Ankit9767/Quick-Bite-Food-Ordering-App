import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-content">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <div className="admin-options">
          <button
            className="admin-btn"
            onClick={() => handleNavigation('/dashboard/admin/restaurants')}
          >
            Manage Restaurants
          </button>
          <button
            className="admin-btn"
            onClick={() => handleNavigation('/dashboard/admin/menu')}
          >
            Manage Menu
          </button>
          <button
            className="admin-btn"
            onClick={() => handleNavigation('/dashboard/admin/menu-items')}
          >
            Manage Menu Items
          </button>
          <button
            className="admin-btn"
            onClick={() => handleNavigation('/dashboard/admin/orders')}
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
