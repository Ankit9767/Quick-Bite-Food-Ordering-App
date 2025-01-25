import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './MenuItemCRUD.css';

const MenuItemCRUD = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    description: '',
    price: 0,
    availability: 'AVAILABLE',
  });
  const [editFoodItem, setEditFoodItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8080/api/restaurants/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRestaurants(response.data))
      .catch(() => setError('Failed to fetch restaurants.'));
  };

  const fetchMenus = (restaurantId) => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:8080/api/menu/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const menusData = Array.isArray(response.data) ? response.data : [response.data];
        setMenus(menusData);
      })
      .catch(() => setError('Failed to fetch menus.'));
  };

  const fetchFoodItems = (menuId) => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:8080/api/food-items/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setFoodItems(response.data))
      .catch(() => setError('Failed to fetch food items.'));
  };

  const handleViewMenu = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    fetchMenus(restaurantId);
  };

  const handleViewFoodItems = (menuId) => {
    setSelectedMenuId(menuId);
    fetchFoodItems(menuId);
  };

  const handleAddFoodItem = () => {
    const token = localStorage.getItem('token');
  
    if (!newFoodItem.name || !newFoodItem.description || !newFoodItem.price || !newFoodItem.availability) {
      setError('Please fill all fields.');
      return;
    }
  
    const payload = {
      name: newFoodItem.name,
      description: newFoodItem.description,
      price: newFoodItem.price,
      availability: newFoodItem.availability,
      menu: {
        id: selectedMenuId,
      },
    };
  
    axios
      .post(`http://localhost:8080/api/food-items/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNewFoodItem({ name: '', description: '', price: '', availability: 'AVAILABLE' });
        fetchFoodItems(selectedMenuId);
        Swal.fire({
          title: 'Food Item Added',
          text: 'The food item has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to add food item.'));
  };

  const handleEditFoodItem = () => {
    const token = localStorage.getItem('token');
  
    if (!editFoodItem.name || !editFoodItem.description || !editFoodItem.price || !editFoodItem.availability) {
      setError('Please fill all fields.');
      return;
    }
  
    const payload = {
      name: editFoodItem.name,
      description: editFoodItem.description,
      price: editFoodItem.price,
      availability: editFoodItem.availability,
      menu: {
        id: selectedMenuId,
      },
    };
  
    axios
      .put(`http://localhost:8080/api/food-items/update/${editFoodItem.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEditFoodItem(null);
        setNewFoodItem({ name: '', description: '', price: '', availability: 'AVAILABLE' });
        fetchFoodItems(selectedMenuId);
        Swal.fire({
          title: 'Food Item Updated',
          text: 'The food item has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to update food item.'));
  };
  

  const handleDeleteFoodItem = (foodItemId) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:8080/api/food-items/delete/${foodItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchFoodItems(selectedMenuId);
        Swal.fire({
          title: 'Food Item Deleted',
          text: 'The food item has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to delete food item.'));
  };

  return (
    <div className="menu-item-crud-container">
      <h2>
        {!selectedRestaurantId
          ? "Restaurants"
          : selectedRestaurantId && !selectedMenuId
          ? "Menus"
          : "Manage Menu Items"}
      </h2>
      
      {error && <p className="error-message">{error}</p>}
  
      {!selectedRestaurantId && (
        <div className="cards-container">
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
  
      {selectedRestaurantId && !selectedMenuId && (
        <div className="cards-container">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <div key={menu.id} className="restaurant-card">
                <h4>{menu.name}</h4>
                <p>Category: {menu.category}</p>
                <button onClick={() => handleViewFoodItems(menu.id)}>
                  View Food Items
                </button>
              </div>
            ))
          ) : (
            <p>No menus available for this restaurant.</p>
          )}
        </div>
      )}
  
      {selectedMenuId && (
        <div className="food-items-container">
          <div className="add-food-item-section">
            <h4>{editFoodItem ? "Edit Food Item" : "Add New Food Item"}</h4>
            <input
              type="text"
              placeholder="Food Name"
              value={editFoodItem ? editFoodItem.name : newFoodItem.name}
              onChange={(e) =>
                editFoodItem
                  ? setEditFoodItem({ ...editFoodItem, name: e.target.value })
                  : setNewFoodItem({ ...newFoodItem, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={
                editFoodItem ? editFoodItem.description : newFoodItem.description
              }
              onChange={(e) =>
                editFoodItem
                  ? setEditFoodItem({ ...editFoodItem, description: e.target.value })
                  : setNewFoodItem({ ...newFoodItem, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={editFoodItem ? editFoodItem.price : newFoodItem.price || ""}
              onChange={(e) =>
                editFoodItem
                  ? setEditFoodItem({ ...editFoodItem, price: parseFloat(e.target.value) })
                  : setNewFoodItem({
                      ...newFoodItem,
                      price: e.target.value ? parseFloat(e.target.value) : "",
                    })
              }
            />
            <select
              value={
                editFoodItem
                  ? editFoodItem.availability
                  : newFoodItem.availability
              }
              onChange={(e) =>
                editFoodItem
                  ? setEditFoodItem({ ...editFoodItem, availability: e.target.value })
                  : setNewFoodItem({ ...newFoodItem, availability: e.target.value })
              }
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
            </select>
  
            <button onClick={editFoodItem ? handleEditFoodItem : handleAddFoodItem}>
              {editFoodItem ? "Update" : "Add"}
            </button>
            {editFoodItem && (
              <button
                onClick={() => setEditFoodItem(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
  
          {foodItems.length > 0 ? (
            <div className="food-item-list">
              {foodItems.map((foodItem) => (
                <div key={foodItem.id} className="food-item">
                  <h4>{foodItem.name}</h4>
                  <p>{foodItem.description}</p>
                  <p>Price: ${foodItem.price}</p>
                  <p>Availability: {foodItem.availability}</p>
                  <div className="food-item-actions">
                    <button onClick={() => setEditFoodItem(foodItem)}>Edit</button>
                    <button onClick={() => handleDeleteFoodItem(foodItem.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No food items available for this menu.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItemCRUD;
