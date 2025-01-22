import React, { useState, useEffect } from "react";
import axios from "axios";
import './Orders.css';
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId || !token) {
        setError("You need to be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]);

  const handleCardClick = (orderId) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            order && order.id ? (
              <div 
                key={order.id} 
                className="order-card" 
                onClick={() => handleCardClick(order.id)}
              >
                <h3>Order ID: {order.id}</h3>
                <p>Status: {order.orderStatus}</p>
                <p>Restaurant: {order.restaurant.name}</p>
                <p>Total Price: ${order.totalPrice}</p>
              </div>
            ) : (
              <div key="invalid" className="order-card">
                <p>Invalid order data.</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
