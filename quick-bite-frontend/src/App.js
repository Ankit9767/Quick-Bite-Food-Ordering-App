import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from './Components/Dashboard/Dashboard';
import BasePage from "./Components/BasePage/BasePage";
import Restaurants from './Components/Restaurants/Restaurants';
import Profile from './Components/Profile/Profile';
import MenuPage from './Components/Menu/MenuPage';
import MenuItemPage from './Components/Menu/MenuItemPage'; 
import Cart from './Components/Cart/Cart';
import Orders from './Components/Orders/Orders';
import OrderDetails from './Components/Orders/OrderDetails';
import Admin from './Components/Admin/Admin';
import RestaurantCRUD from './Components/Admin/RestaurantsCRUD';
import MenuCRUD from './Components/Admin/MenuCRUD';
import MenuItemCRUD from './Components/Admin/MenuItemCRUD'
import OrdersCRUD from './Components/Admin/OrdersCRUD';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/basepage" />} />
            <Route path="/basepage" element={<BasePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/restaurants" />} />
            <Route path="/dashboard/*" element={<Dashboard />} >
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="restaurants/:restaurantId/menu" element={<MenuPage />} />
              <Route path="restaurants/:restaurantId/menu/:menuId" element={<MenuItemPage />} /> 
              <Route path="cart" element={<Cart />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="admin" element={<Admin />} />
              <Route path="admin/restaurants" element={<RestaurantCRUD />} />
              <Route path="admin/menu" element={<MenuCRUD />} />
              <Route path="admin/menu-items" element={<MenuItemCRUD />} />
              <Route path="admin/orders" element={<OrdersCRUD />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </div>
  );
}

export default App;
