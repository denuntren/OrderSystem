import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";
import { resolveRefs } from "../../utils";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No authorization token found.");
                }

                const response = await axios.get("http://localhost:5131/api/Orders/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const resolvedData = resolveRefs(response.data);

                if (resolvedData && resolvedData.$values) {
                    const processedOrders = resolvedData.$values.map(order => ({
                        ...order,
                        orderItems: order.orderItems.$values.map(item => ({
                            ...item,
                            productName: item.product?.name || `Unknown Product (ID: ${item.productId})`,
                        })),
                    }));

                    setOrders(processedOrders);
                } else {
                    setError("Invalid data format");
                }
            } catch (error) {
                setError(error.message);
                toast.error("Помилка при завантаженні замовлень. Спробуйте ще раз.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("No authorization token found.");
            }

            const response = await axios.get("http://localhost:5131/api/Orders/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resolvedData = resolveRefs(response.data);

            if (resolvedData && resolvedData.$values) {
                const processedOrders = resolvedData.$values.map(order => ({
                    ...order,
                    orderItems: order.orderItems.$values.map(item => ({
                        ...item,
                        productName: item.product?.name || `Unknown Product (ID: ${item.productId})`,
                    })),
                }));

                setOrders(processedOrders);
                toast.success("Замовлення завантажились!");
            } else {
                setError("Invalid data format");
            }
        } catch (error) {
            toast.error("Помилка при завантаженні замовлень. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">Your Orders</h1>
            <button className="refresh-button" onClick={handleRefresh}>
                Refresh Orders
            </button>
            <table className="orders-table">
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Items</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>
                            {order.orderItems.length > 0 ? (
                                <ul>
                                    {order.orderItems.map(item => (
                                        <li key={item.id}>
                                            <strong>{item.productName}</strong>, Quantity: {item.quantity}, Price: $
                                            {item.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items in this order</p>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
