import { useState } from "react";

const API_URL = "https://coffee-shop-backend-8pcw.onrender.com/api/orders";

function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCart,
}) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    orderType: "Pickup",
    paymentMethod: "Cash on Pickup",
    address: "",
    note: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openOrderForm() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setShowOrderForm(true);

    setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customer.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!customer.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (
      customer.orderType === "Delivery" &&
      !customer.address.trim()
    ) {
      alert("Please enter your delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          orderType: customer.orderType,
          paymentMethod: customer.paymentMethod,

          items: cart.map((item) => ({
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),

          total,
          note: customer.note.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      console.log("Order saved:", data);

      setOrderPlaced(true);
      setCart([]);
    } catch (error) {
      console.error("Order error:", error);

      alert(
        "Could not place the order. Please make sure the backend is running on port 5000."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (orderPlaced) {
    return (
      <section className="success-section">
        <div className="success-box">
          <div className="success-icon">✅</div>

          <h2>Order Placed Successfully!</h2>

          <p>
            Thank you for ordering from Wedajo Coffee.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setOrderPlaced(false);
              setShowOrderForm(false);
            }}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-section">
      <div className="section-title">
        <p className="small-title">YOUR ORDER</p>
        <h2>Shopping Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h3>Your cart is empty.</h3>

          <a href="/menu" className="primary-btn">
            Choose Coffee
          </a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.name}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{Number(item.price)} ETB each</p>
                </div>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.name)}
                  >
                    −
                  </button>

                  <strong>{item.quantity}</strong>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.name)}
                  >
                    +
                  </button>
                </div>

                <strong>
                  {Number(item.price) * item.quantity} ETB
                </strong>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFromCart(item.name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            Total: {total} ETB
          </div>

          {!showOrderForm && (
            <button
              type="button"
              className="place-order-btn"
              onClick={openOrderForm}
            >
              Continue to Order
            </button>
          )}

          {showOrderForm && (
            <form
              id="order-form"
              className="order-form"
              onSubmit={placeOrder}
            >
              <h2>Customer Information</h2>

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="09XXXXXXXX"
              />

              <label>Order Type</label>

              <div className="order-type">
                <label>
                  <input
                    type="radio"
                    name="orderType"
                    value="Pickup"
                    checked={customer.orderType === "Pickup"}
                    onChange={handleChange}
                  />
                  Pickup
                </label>

                <label>
                  <input
                    type="radio"
                    name="orderType"
                    value="Delivery"
                    checked={customer.orderType === "Delivery"}
                    onChange={handleChange}
                  />
                  Delivery
                </label>
              </div>

              {customer.orderType === "Delivery" && (
                <>
                  <label>Delivery Address</label>

                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    placeholder="Enter delivery address"
                  />
                </>
              )}

              <label>Payment Method</label>

              <select
                name="paymentMethod"
                value={customer.paymentMethod}
                onChange={handleChange}
              >
                <option value="Cash on Pickup">
                  💵 Cash on Pickup
                </option>

                <option value="Telebirr">
                  📱 Telebirr
                </option>


                <option value="Bank Transfer">
                  🏦 Bank Transfer
                </option>
              </select>

              {customer.paymentMethod === "Bank Transfer" && (
                <div className="payment-details">
                  🏦 Bank Account: <strong>1000303329505</strong>
                </div>
              )}

              {customer.paymentMethod === "Telebirr" && (
                <div className="payment-details">
                  📱 Telebirr: <strong>+251 938 253 812</strong>
                </div>
              )}

              <label>Additional Note</label>

              <textarea
                name="note"
                value={customer.note}
                onChange={handleChange}
                placeholder="Any additional request?"
              />

              <div className="order-summary">
                <h3>Order Summary</h3>

                {cart.map((item) => (
                  <p key={item.name}>
                    {item.name} × {item.quantity}

                    <span>
                      {Number(item.price) * item.quantity} ETB
                    </span>
                  </p>
                ))}

                <p>
                  Payment
                  <span>{customer.paymentMethod}</span>
                </p>

                <div className="summary-total">
                  Total: {total} ETB
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </form>
          )}
        </>
      )}
    </section>
  );
}

export default Cart;
