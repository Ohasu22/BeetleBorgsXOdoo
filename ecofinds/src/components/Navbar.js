import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/storage";

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <nav id="navigation" className="navigation">
      <div className="nav-container">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">
              <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span className="logo-text">EcoFinds</span>
          </div>

          <div className="nav-items">
            <NavLink className="nav-button" to="/">Home</NavLink>
            <NavLink className="nav-button" to="/add-product">Sell</NavLink>
            <NavLink className="nav-button" to="/my-listings">My Items</NavLink>
            <NavLink className="nav-button" to="/cart">
              Cart
              {cartCount > 0 && <span id="cart-badge" className="cart-badge">{cartCount}</span>}
            </NavLink>
            <NavLink className="nav-button" to="/purchases">Purchases</NavLink>

            <div className="account-dropdown">
              <button className="nav-button account-button">Account</button>
              <div className="dropdown-menu">
                <button className="dropdown-item logout-btn" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
