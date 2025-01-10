// src/components/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5131/api/Orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div>
            <h1>Your Orders</h1>
            <table>
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
                            {order.orderItems.map(item => (
                                <p key={item.productId}>
                                    Product ID: {item.productId}, Quantity: {item.quantity}, Price: $
                                    {item.price.toFixed(2)}
                                </p>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
