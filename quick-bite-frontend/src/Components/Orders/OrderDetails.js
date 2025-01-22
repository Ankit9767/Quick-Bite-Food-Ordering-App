import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
      } catch (err) {
        setError("Failed to fetch order details.");
      }
    };

    if (token) {
      fetchOrderDetails();
    } else {
      setError("You are not authorized. Please log in.");
    }
  }, [orderId, token]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!order) {
    return <p className="loading">Loading order details...</p>;
  }

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>

      <section className="details-section">
        <h3>Order Information</h3>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
      </section>

      <section className="details-section">
        <h3>Restaurant Details</h3>
        <p><strong>Restaurant:</strong> {order.restaurant.name}</p>
      </section>

      <section className="details-section">
        <h3>Order Items</h3>
        <ul className="order-items-list">
          {order.orderItems.map((item) => (
            <li key={item.id} className="order-item">
              <p><strong>{item.foodItem.name}</strong> (x{item.quantity}) - ${item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OrderDetails;
