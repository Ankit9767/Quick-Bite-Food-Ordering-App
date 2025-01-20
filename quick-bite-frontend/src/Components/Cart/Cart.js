import React, { useEffect, useState } from "react";
import axios from "axios";
import './Cart.css';
import defaultImage from '../../assets/images/default.jpg';

import Swal from 'sweetalert2';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryPersonId] = useState(2);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      setError("You need to be logged in to view your cart.");
      setLoading(false);
      return;
    }

    const fetchCartId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/carts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setCartId(response.data.id);
        } else {
          setError("Cart not found for this user.");
        }
      } catch (err) {
        setError("Failed to fetch cart ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartId();
  }, [userId, token]);

  useEffect(() => {
    if (cartId) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/cart-items/cart/all/${cartId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCartItems(response.data || []);
          const initialQuantities = {};
          response.data.forEach(item => {
            initialQuantities[item.id] = item.quantity;
          });
          setQuantities(initialQuantities);
        } catch (err) {
          setError("Failed to fetch cart items.");
        }
      };
      fetchCartItems();
    }
  }, [cartId, token]);

  const getImageUrl = (foodName) => {
    const imageName = foodName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    try {
      const imageUrl = require(`../../assets/images/${imageName}.jpg`);
      return imageUrl;
    } catch (error) {
      return defaultImage;
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => {
      const currentQuantity = prev[itemId] || 1;
      const newQuantity = currentQuantity + delta;
      return newQuantity > 0 ? { ...prev, [itemId]: newQuantity } : prev;
    });
  };

  const handleDoneEditing = async (itemId) => {
    const updatedQuantity = quantities[itemId];
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: updatedQuantity } : item
    );
    setCartItems(updatedCartItems);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/cart-items/update/${itemId}`,
        { quantity: updatedQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setEditingItemId(null);
        setQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[itemId];
          return newQuantities;
        });
      } else {
        setError("Failed to update the cart item.");
      }
    } catch (err) {
      setError("Error updating item in the cart.");
    }
  };


const handleRemoveFromCart = async (itemId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/cart-items/delete/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      window.localStorage.setItem('cartUpdated', 'true');
      window.localStorage.setItem('cartItemsCount', cartItems.length - 1);

      Swal.fire({
        title: "Item Removed",
        text: `Item has been removed from your cart.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "custom-ok-button",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    } else {
      setError("Failed to remove the item from the cart.");
    }
  } catch (err) {
    setError("Error removing item from the cart.");
  }
};



const handlePlaceOrder = async () => {
  setOrderPlaced(true);
  try {
    const response = await axios.post(
      `http://localhost:8080/api/orders/place/${cartId}`,
      null,
      {
        params: { deliveryPersonId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 201) {
      Swal.fire({
        title: "Order Placed Successfully!",
        text: `Your order has been placed successfully! Order ID: ${response.data.id}`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "custom-ok-button",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      }).then(() => {
        setCartItems([]);
        setCartId(null);
        window.localStorage.setItem('cartItemsCount', '0');
        window.localStorage.setItem('cartUpdated', 'true');
      });
    }
  } catch (err) {
    setError("Failed to place order. Please try again.");
  } finally {
    setOrderPlaced(false);
  }
};

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="food-item-card">
              <img
                src={getImageUrl(item.foodItem.name)}
                alt={item.foodItem.name}
                className="food-item-image"
              />
              <div className="food-item-info">
                <h3>{item.foodItem.name}</h3>
                <p>{item.foodItem.description}</p>
                <p className="price">${item.foodItem.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>

              <div className="food-item-footer">
                {editingItemId === item.id ? (
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={quantities[item.id] <= 1}
                    >
                      -
                    </button>
                    <span>{quantities[item.id]}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      +
                    </button>
                    <button onClick={() => handleDoneEditing(item.id)}>
                      Done
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="remove-button"
                      onClick={() => setEditingItemId(item.id)}
                    >
                      Edit Quantity
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && !orderPlaced && (
        <div className="place-order-btn-container">
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
