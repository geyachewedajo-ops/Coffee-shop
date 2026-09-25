import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  Link
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";

function ProtectedAdmin() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminPage />;
}

function App() {
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function addToCart(item) {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1
              }
            : cartItem
        );
      }

      return [
        ...previousCart,
        {
          ...item,
          quantity: 1
        }
      ];
    });
  }

  function increaseQuantity(name) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  }

  function decreaseQuantity(name) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.name === name
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(name) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.name !== name)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <nav className="navbar">

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          ☕ Wedajo Coffee
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={menuOpen ? "nav-menu open" : "nav-menu"}>

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/menu" onClick={closeMenu}>
            Menu
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/cart" onClick={closeMenu}>
            🛒 Cart ({cartCount})
          </Link>

          <Link to="/admin/login" onClick={closeMenu}>
            Admin
          </Link>

        </div>
      </nav>

      <main>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/menu"
            element={
              <Menu addToCart={addToCart} />
            }
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
                setCart={setCart}
              />
            }
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={<ProtectedAdmin />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      <footer className="footer">
        <p>
          © 2026 Wedajo Coffee. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default App;
