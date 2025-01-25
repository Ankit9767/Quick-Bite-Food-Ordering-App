import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersCRUD.css';

const OrdersCRUD = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/orders/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch orders');
        console.error(err);
      });
  }, [token]);

  const handleUpdateOrder = (orderId) => {
    console.log('Update order:', orderId);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      axios
        .delete(`http://localhost:8080/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert('Order deleted successfully');
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        })
        .catch((err) => {
          alert('Failed to delete order');
          console.error(err);
        });
    }
  };

  return (
    <div className="orders-crud-container">
      <h2>Manage Orders</h2>
      {error && <p className="error-message">{error}</p>}
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Restaurant</th>
              <th>Delivery Person</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.restaurant?.name || 'N/A'}</td>
                <td>{order.deliveryPerson?.firstName || 'N/A'}</td>
                <td>{order.orderStatus}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleUpdateOrder(order.id)}
                    className="action-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrdersCRUD;
