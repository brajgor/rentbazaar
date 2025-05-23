import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns"; 
import { Link } from "react-router-dom";

const ORDER_STATUSES = {
  1: "Pending",
  2: "Approved"
}

const OFFER_TYPES = {
  1: "Game Currency",
  2: "Account",
};

const Orders = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/getOrders/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Error loading orders", error));
  }, [userId]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const fetchOrders = async () => {
    const response = await fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/${userId}`);
    const data = await response.json();
    setOrders(data.orders || []);
  };

  const approveOrder = async (id) => {
    try {
      const response = await fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/updateOrder/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
  
      if (!response.ok) throw new Error("Error updating");
  
      window.location.reload();
    } catch (error) {
      console.error("Error", error);
    }
}

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      <div className="row">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="col-12 mb-3">
              <div className="card shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title">Order #{order.id}</h5>
                    <p className="card-text">
                        
                      <strong>Status:</strong> {ORDER_STATUSES[order.status] || "Unknown status"}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong> {format(new Date(order.createdAt), "dd.MM.yyyy")}
                    </p>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrderId === order.id ? "Hide details" : "Show details"}
                    </button>
                  </div>

                  <div className="d-flex">
                    {order.status === 2 ? null : <button className="btn btn-success me-2" onClick={() => approveOrder(order.id)}>Approve</button>}
                    <Link to={`/review/${order.offer.id}`} className="btn btn-primary">Review</Link>
                  </div>
                </div>

                {expandedOrderId === order.id && order.offer && (
                  <div className="card-footer bg-light">
                    <h6 className="mb-2">{order.offer.name}</h6>
                    <p className="mb-1"><strong>Category:</strong> {OFFER_TYPES[order.offer.type]}</p>
                    <p className="mb-1"><strong>Price:</strong> {order.offer.price} €</p>
                    <p className="mb-1"><strong>Description:</strong> {order.offer.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default Orders;