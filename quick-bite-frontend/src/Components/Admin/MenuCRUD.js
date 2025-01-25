import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./MenuCRUD.css";

const MenuCRUD = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [editMenu, setEditMenu] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/restaurants/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRestaurants(response.data))
      .catch(() => setError("Failed to fetch restaurants."));
  };

  const fetchMenus = (restaurantId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8080/api/menu/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const menusData = Array.isArray(response.data) ? response.data : [response.data];
        setMenus(menusData);
      })
      .catch(() => setError("Failed to fetch menus."));
  };

  const handleViewMenu = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    fetchMenus(restaurantId);
  };

  const handleAddMenu = () => {
    const token = localStorage.getItem("token");
    const payload = {
      restaurant: { id: selectedRestaurantId },
      name: newMenu.name,
      category: selectedCategory,
    };

    axios
      .post("http://localhost:8080/api/menu/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNewMenu({ name: "" });
        fetchMenus(selectedRestaurantId);
        Swal.fire({
          title: "Menu Added",
          text: "The menu has been added successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "custom-ok-button",
          },
        });
      })
      .catch(() => setError("Failed to add menu."));
  };

  const handleEditMenu = () => {
    const token = localStorage.getItem("token");
    const payload = {
      name: editMenu.name,
      category: editMenu.category,
      restaurant: { id: selectedRestaurantId },
    };

    axios
      .put(`http://localhost:8080/api/menu/update/${editMenu.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEditMenu(null);
        fetchMenus(selectedRestaurantId);
        Swal.fire({
          title: "Menu Updated",
          text: "The menu has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "custom-ok-button",
          },
        });
      })
      .catch((error) => {
        setError("Failed to update menu.");
        console.log(error);
      });
  };

  // Delete a menu
  const handleDeleteMenu = (menuId) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:8080/api/menu/delete/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchMenus(selectedRestaurantId);
        Swal.fire({
          title: "Menu Deleted",
          text: "The menu has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "custom-ok-button",
          },
        });
      })
      .catch(() => setError("Failed to delete menu."));
  };

  return (
    <div className="menu-crud-container">
      <h2>
        {!editMenu && selectedRestaurantId === null
          ? "Restaurants"
          : "Manage Menus"}
      </h2>
      {error && <p className="error-message">{error}</p>}
  
      {!editMenu && selectedRestaurantId === null && (
        <div className="restaurant-cards">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-card">
                <h4>{restaurant.name}</h4>
                <p>{restaurant.address}</p>
                <button onClick={() => handleViewMenu(restaurant.id)}>
                  View Menus
                </button>
              </div>
            ))
          ) : (
            <p>No restaurants available.</p>
          )}
        </div>
      )}
  
      {selectedRestaurantId && !editMenu && (
        <div className="add-menu-section">
          <h3>Add Menu</h3>
          <input
            type="text"
            placeholder="Menu Name"
            value={newMenu.name}
            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          />
  
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="SOUP">SOUP</option>
            <option value="APPETIZER">APPETIZER</option>
            <option value="SALAD">SALAD</option>
            <option value="MAIN_COURSE">MAIN_COURSE</option>
            <option value="DESSERTS">DESSERTS</option>
            <option value="BEVERAGES">BEVERAGES</option>
            <option value="ALCOHOLS">ALCOHOLS</option>
          </select>
  
          <button onClick={handleAddMenu}>Add Menu</button>
        </div>
      )}
  
      {selectedRestaurantId && !editMenu && (
        <div className="menu-list">
          <h3>Menus for Restaurant</h3>
          {menus.length > 0 ? (
            menus.map((menu) => (
              <div key={menu.id} className="menu-item">
                <h4>{menu.name}</h4>
                <p>Category: {menu.category}</p>
                <div className="menu-actions">
                  <button onClick={() => setEditMenu(menu)}>Edit</button>
                  <button onClick={() => handleDeleteMenu(menu.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No menus available for this restaurant.</p>
          )}
        </div>
      )}
  
      {editMenu && (
        <div className="edit-menu-section">
          <h3>Edit Menu</h3>
          <input
            type="text"
            value={editMenu.name}
            onChange={(e) => setEditMenu({ ...editMenu, name: e.target.value })}
          />
  
          <select
            value={editMenu.category}
            onChange={(e) => setEditMenu({ ...editMenu, category: e.target.value })}
          >
            <option value="SOUP">SOUP</option>
            <option value="APPETIZER">APPETIZER</option>
            <option value="SALAD">SALAD</option>
            <option value="MAIN_COURSE">MAIN_COURSE</option>
            <option value="DESSERTS">DESSERTS</option>
            <option value="BEVERAGES">BEVERAGES</option>
            <option value="ALCOHOLS">ALCOHOLS</option>
          </select>
  
          <button onClick={handleEditMenu}>Update Menu</button>
          <button onClick={() => setEditMenu(null)} className="cancel-button">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
  
};

export default MenuCRUD;
