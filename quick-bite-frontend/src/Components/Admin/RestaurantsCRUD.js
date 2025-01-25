import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RestaurantsCRUD.css';

const RestaurantsCRUD = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    description: '',
    city: '',
    phone: '',
  });
  const [editRestaurant, setEditRestaurant] = useState(null);
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

  const handleAddRestaurant = () => {
    const token = localStorage.getItem('token');
    const payload = {
      name: newRestaurant.name,
      address: newRestaurant.address,
      description: newRestaurant.description,
      city: newRestaurant.city,
      phone: newRestaurant.phone,
    };

    axios
      .post('http://localhost:8080/api/restaurants/add', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNewRestaurant({ name: '', address: '', description: '', city: '', phone: '' });
        fetchRestaurants();
        Swal.fire({
          title: 'Restaurant Added',
          text: 'The restaurant has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to add restaurant.'));
  };

  const handleUpdateRestaurant = () => {
    const token = localStorage.getItem('token');
    const payload = {
      name: editRestaurant.name,
      address: editRestaurant.address,
      description: editRestaurant.description,
      city: editRestaurant.city,
      phone: editRestaurant.phone,
    };

    axios
      .put(
        `http://localhost:8080/api/restaurants/update/${editRestaurant.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setEditRestaurant(null);
        fetchRestaurants();
        Swal.fire({
          title: 'Restaurant Updated',
          text: 'The restaurant has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to update restaurant.'));
  };

  const handleDeleteRestaurant = (restaurantId) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:8080/api/restaurants/delete/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchRestaurants();
        Swal.fire({
          title: 'Restaurant Deleted',
          text: 'The restaurant has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'custom-ok-button',
          },
        });
      })
      .catch(() => setError('Failed to delete restaurant.'));
  };

  return (
    <div className="restaurants-crud-container">
      <h2>Manage Restaurants</h2>
      {error && <p className="error-message">{error}</p>}

      {!editRestaurant && (
        <div className="add-restaurant-section">
          <h3>Add Restaurant</h3>
          <input
            type="text"
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={newRestaurant.address}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newRestaurant.description}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={newRestaurant.city}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newRestaurant.phone}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
          />
          <button onClick={handleAddRestaurant}>Add Restaurant</button>
        </div>
      )}

      {editRestaurant && (
        <div className="edit-restaurant-section">
          <h3>Edit Restaurant</h3>
          <input
            type="text"
            value={editRestaurant.name}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={editRestaurant.address}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={editRestaurant.description}
            onChange={(e) =>
              setEditRestaurant({ ...editRestaurant, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={editRestaurant.city || ''}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={editRestaurant.phone || ''}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, phone: e.target.value })}
          />
          <button onClick={handleUpdateRestaurant}>Update</button>
          <button className="cancel-button" onClick={() => setEditRestaurant(null)}>
            Cancel
          </button>
        </div>
      )}

      <div className="restaurants-list">
        <h3>Restaurant List</h3>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-item">
            <div>
              <h4>{restaurant.name}</h4>
              <p>Address : {restaurant.address}</p>
              <p>Description : {restaurant.description}</p>
              <p>City: {restaurant.city}</p>
              <p>Phone: {restaurant.phone}</p>
            </div>
            <div className="restaurant-actions">
              <button onClick={() => setEditRestaurant(restaurant)}>Edit</button>
              <button onClick={() => handleDeleteRestaurant(restaurant.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsCRUD;
