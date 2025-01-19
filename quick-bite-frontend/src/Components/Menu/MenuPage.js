import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './MenuPage.css';

const MenuPage = () => {
  const { restaurantId } = useParams();  
  const navigate = useNavigate();  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setError("You need to be logged in to view the menu.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/restaurants/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurant(response.data); 
      } catch (err) {
        setError("Failed to fetch menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const handleMenuClick = (menuId) => {
    navigate(`/dashboard/restaurants/${restaurantId}/menu/${menuId}`); 
  };

  if (loading) {
    return <div className="menu-container">Loading menu...</div>;
  }

  if (error) {
    return <div className="menu-container">{error}</div>;
  }

  return (
    <div className="menu-container">
      <h2>Menu for {restaurant.name}</h2>

      {restaurant.menus && restaurant.menus.length > 0 ? (
        <div className="menu-categories">
          {restaurant.menus.map((menu) => (
            <div
              key={menu.id}
              className="menu-category"
              onClick={() => handleMenuClick(menu.id)} 
            >
              <h3>{menu.name}</h3>
              <p>Category: {menu.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No menus available for this restaurant.</p>
      )}
    </div>
  );
};

export default MenuPage;
