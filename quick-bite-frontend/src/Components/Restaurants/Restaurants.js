import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getImagePath = (restaurantName) => {
    try {
      const formattedName = restaurantName.toLowerCase().replace(/\s+/g, "_");
      return require(`../../assets/images/${formattedName}.jpg`);
    } catch (error) {
      return require("../../assets/images/default.jpg");
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:8080/api/restaurants/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (err) {
        setError("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/dashboard/restaurants/${restaurantId}/menu`);
  };

  if (loading) {
    return <div className="restaurants-container">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="restaurants-container">{error}</div>;
  }

  return (
    <div className="restaurants-container">
      <h2 className="restaurants-header">Explore Restaurants</h2>
      <div className="restaurant-cards">
        {restaurants.map((restaurant) => (
          <div
            className="restaurant-card"
            key={restaurant.id}
            onClick={() => handleRestaurantClick(restaurant.id)}
          >
            <img
              src={getImagePath(restaurant.name)}
              alt={restaurant.name}
              className="restaurant-image"
            />
            <div className="restaurant-info">
              <h3 className="restaurant-name">{restaurant.name}</h3>
              <p className="restaurant-location">{restaurant.city}</p>
              <p className="restaurant-cuisine">Cuisine: {restaurant.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
