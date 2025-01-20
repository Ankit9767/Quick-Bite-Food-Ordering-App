import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [addedItems, setAddedItems] = useState(new Set()); 
  const [cartId, setCartId] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const fetchCartData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) return;

    try {
      const cartResponse = await axios.get(
        `http://localhost:8080/api/carts/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (cartResponse.data) {
        const cartId = cartResponse.data.id;
        setCartId(cartId);

        const cartItemsResponse = await axios.get(
          `http://localhost:8080/api/cart-items/cart/all/${cartId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cartItems = cartItemsResponse.data || [];
        const newAddedItems = new Set(cartItems.map(item => item.foodItem.id));
        setAddedItems(newAddedItems);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    const checkCartUpdate = () => {
      const cartUpdated = window.localStorage.getItem('cartUpdated');
      const cartItemsCount = window.localStorage.getItem('cartItemsCount');

      if (cartUpdated === 'true') {
        fetchCartData(); 

        if (cartItemsCount) {
          setAddedItems(new Set(Array(Number(cartItemsCount)).fill(true)));
        }

        window.localStorage.setItem('cartUpdated', 'false');
      }
    };

    checkCartUpdate();

    const interval = setInterval(checkCartUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <span className="navbar-title">Dashboard</span>
        </div>
        <div className="navbar-right">
          <div className="cart-icon" onClick={() => navigate("/dashboard/cart")}>
            <i className="fas fa-shopping-cart"></i>
            {addedItems.size > 0 && (
              <span className="cart-count">{addedItems.size}</span>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="sidebar-menu">
          <li><NavLink to="/dashboard/restaurants">Restaurants</NavLink></li>
          <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
          <li><NavLink to="/dashboard/cart">Cart</NavLink></li>
          <li><NavLink to="/dashboard/orders">Orders</NavLink></li>
          {userRole === 'ADMIN' && (
            <li><NavLink to="/dashboard/admin">Admin</NavLink></li>
          )}
        </ul>
        {cartId && (
          <div className="cart-id-display">
            <p>Cart ID: {cartId}</p>
          </div>
        )}
      </div>

      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
