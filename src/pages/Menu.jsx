import React from "react";

const menuItems = [
  {
    name: "Coffee",
    price: 50,
    image: "/images/coffee.jpeg",
    description: "Freshly brewed Ethiopian coffee.",
  },
  {
    name: "Cappuccino",
    price: 80,
    image: "/images/cappuccino.jpeg",
    description: "Smooth espresso with steamed milk and foam.",
  },
  {
    name: "Tea",
    price: 40,
    image: "/images/tea.jpeg",
    description: "Fresh and refreshing hot tea.",
  },
  {
    name: "Cake",
    price: 100,
    image: "/images/cake.jpeg",
    description: "Fresh and delicious cake.",
  },
];

function Menu({ addToCart }) {
  function handleOrder(item) {
    console.log("Adding to cart:", item);
    addToCart(item);
    alert(`${item.name} added to cart!`);
  }

  return (
    <section className="menu">
      <div className="menu-container">
        <h1>Our Menu</h1>

        <p className="menu-subtitle">
          Fresh drinks and delicious treats
        </p>

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div className="menu-card" key={item.name}>
              <img src={item.image} alt={item.name} />

              <div className="menu-card-content">
                <h2>{item.name}</h2>

                <p>{item.description}</p>

                <div className="menu-bottom">
                  <span>{item.price} ETB</span>

                  <button
                    type="button"
                    className="add-to-cart"
                    onClick={() => handleOrder(item)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Menu;
