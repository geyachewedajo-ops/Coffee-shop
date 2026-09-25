import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/orders";

function Admin() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function getToken() {
    return localStorage.getItem("adminToken");
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  async function getOrders() {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);

      alert(
        "Could not load orders. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Status error:", error);

      alert("Could not update order status.");
    }
  }

  async function deleteOrder(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete order"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order._id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      alert("Could not delete order.");
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <p className="small-title">
            ADMIN PANEL
          </p>

          <h2>Customer Orders</h2>
        </div>

        <div className="admin-header-buttons">
          <button
            type="button"
            className="primary-btn"
            onClick={getOrders}
          >
            🔄 Refresh
          </button>

          <button
            type="button"
            className="logout-btn"
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-message">
          <div className="admin-empty-icon">
            ⏳
          </div>

          <h3>Loading Orders...</h3>

          <p>Please wait.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-message">
          <div className="admin-empty-icon">
            📦
          </div>

          <h3>No Orders Yet</h3>

          <p>
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-orders">
          {orders.map((order) => (
            <div
              className="admin-order-card"
              key={order._id}
            >
              <div className="admin-order-header">
                <div>
                  <h3>
                    👤 {order.customerName}
                  </h3>

                  <p>
                    📞 {order.phone}
                  </p>
                </div>

                <span
                  className={`status status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="admin-order-details">
                <p>
                  <strong>
                    Order Type:
                  </strong>{" "}
                  {order.orderType}
                </p>

                {order.address && (
                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {order.address}
                  </p>
                )}

                {order.note && (
                  <p>
                    <strong>
                      Note:
                    </strong>{" "}
                    {order.note}
                  </p>
                )}
              </div>

              <div className="admin-items">
                <h4>Items</h4>

                {order.items.map(
                  (item, index) => (
                    <div
                      className="admin-item"
                      key={
                        item._id || index
                      }
                    >
                      <span>
                        {item.name} ×{" "}
                        {item.quantity}
                      </span>

                      <strong>
                        {item.price *
                          item.quantity}{" "}
                        ETB
                      </strong>
                    </div>
                  )
                )}
              </div>

              <div className="admin-total">
                Total: {order.total} ETB
              </div>

              <div className="admin-actions">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Pending"
                    )
                  }
                >
                  🟡 Pending
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Preparing"
                    )
                  }
                >
                  ☕ Preparing
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Ready"
                    )
                  }
                >
                  ✅ Ready
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Delivered"
                    )
                  }
                >
                  🚚 Delivered
                </button>

                <button
                  type="button"
                  className="delete-order-btn"
                  onClick={() =>
                    deleteOrder(order._id)
                  }
                >
                  🗑️ Delete
                </button>
              </div>

              <p className="order-date">
                Ordered:{" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
