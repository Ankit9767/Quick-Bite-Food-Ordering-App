
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './MenuItemPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';

const MenuItemPage = () => {
  const { restaurantId, menuId } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedItems, setAddedItems] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [cartId, setCartId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(null);

  const navigate = useNavigate();

  const getImagePath = (itemName) => {
    const formattedItemName = itemName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .concat('.jpg');

    try {
      return require(`../../assets/images/${formattedItemName}`);
    } catch (error) {
      return require('../../assets/images/default.jpg');
    }
  };

  useEffect(() => {
    const fetchFoodItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to view the menu items.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/food-items/menu/${menuId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFoodItems(response.data);
      } catch (err) {
        setError("Failed to fetch food items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCartId = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId || !token) {
        setError("You need to be logged in to fetch the cart.");
        setLoading(false);
        return;
      }

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
        setError("Failed to fetch cart ID. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
    fetchCartId();
  }, [restaurantId, menuId]);

  const fetchCartItems = async (cartId) => {
    const token = localStorage.getItem("token");

    if (!cartId || !token) {
      setError("Invalid cart ID or token.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart-items/cart/all/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartItems = response.data || [];

      if (!Array.isArray(cartItems)) {
        console.error('Expected an array but got:', typeof cartItems);
        return;
      }

      const newAddedItems = new Set(cartItems.map(item => item.foodItem.id));
      setAddedItems(newAddedItems);

      const newQuantities = {};
      cartItems.forEach(item => {
        if (item.foodItem.id && item.quantity) {
          newQuantities[item.foodItem.id] = item.quantity;
        }
      });

      setQuantities(newQuantities);

    } catch (err) {
      setError("Error fetching cart items.");
    }
  };

  useEffect(() => {
    if (cartId) {
      fetchCartItems(cartId);
    }
  }, [cartId]);

  const handleAddToCart = (itemId) => {
    const currentQuantity = quantities[itemId] || 1;
    setEditingQuantity(itemId);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: currentQuantity,
    }));
  };

  const handleQuantityChange = (itemId, delta) => {
    const newQuantity = (quantities[itemId]) + delta;
    if (newQuantity < 1) return;

    setQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities, [itemId]: newQuantity };
      return newQuantities;
    });
  };

  const handleAddNow = (itemId) => {
    const quantity = quantities[itemId] || 1;

    if (!cartId) {
      setError("Cart ID is not available.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to be logged in to add items to the cart.");
      return;
    }

    if (addedItems.has(itemId)) {
      const formData = new FormData();
      formData.append("cartId", cartId);
      formData.append("foodItemId", itemId);
      formData.append("quantity", quantity);

      axios.put(
        `http://localhost:8080/api/cart-items/update/${itemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => {
        if (response.data) {
          setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: quantity,
          }));

          Swal.fire({
            title: 'Success!',
            text: 'Item updated in the cart.',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: "custom-ok-button",
            },
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            }
          });

          setEditingQuantity(null);
        } else {
          setError("Failed to update the cart item.");
        }
      })
      .catch(err => {
        setError("Error updating item in the cart.");
      });
    } else {
      const formData = new FormData();
      formData.append("cartId", cartId);
      formData.append("foodItemId", itemId);
      formData.append("quantity", quantity);

      axios.post(
        `http://localhost:8080/api/cart-items/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => {
        setAddedItems(prevItems => {
          const newAddedItems = new Set(prevItems);
          newAddedItems.add(itemId);
          return newAddedItems;
        });

        Swal.fire({
          title: 'Success!',
          text: 'Item added to cart!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        setEditingQuantity(null);
      })
      .catch(err => {
        setError("Failed to add item to cart. Please try again later.");
      });
    }
  };

  if (loading) {
    return <div className="menu-item-container">Loading food items...</div>;
  }

  if (error) {
    return <div className="menu-item-container">{error}</div>;
  }

  return (
    <div className="menu-item-container">

      <div className="cart-icon" onClick={() => navigate("/dashboard/cart")}>
        <i className="fas fa-shopping-cart"></i>
        {addedItems.size > 0 && (
          <span className="cart-count">{addedItems.size}</span>
        )}
      </div>

      <h2>Food Items in Menu</h2>

      {foodItems && foodItems.length > 0 ? (
        <div className="food-item-cards">
          {foodItems.map((item) => (
            <div key={item.id} className="food-item-card">
              <img
                src={getImagePath(item.name)}
                alt={item.name}
                className="food-item-image"
              />
              <div className="food-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">${item.price}</p>
              </div>

              {editingQuantity === item.id && (
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
                  <div className="add-to-cart-footer">
                    <button onClick={() => handleAddNow(item.id)}>
                      Add Now
                    </button>
                  </div>
                </div>
              )}

              {!addedItems.has(item.id) && editingQuantity !== item.id && (
                <div className="food-item-footer">
                  <button className="add-button" onClick={() => handleAddToCart(item.id)}>
                    Add to Cart
                  </button>
                </div>
              )}

              {addedItems.has(item.id) && !editingQuantity && (
                <div className="food-item-footer">
                  <span>Item already in Cart</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No food items available for this menu.</p>
      )}
    </div>
  );
};

export default MenuItemPage;
