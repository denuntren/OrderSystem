import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, userId, authToken } = useCart();
    const navigate = useNavigate();

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    useEffect(() => {
        if (!authToken || !userId) {
            toast.error("Користувач не авторизований.");
            navigate("/login");
        }
    }, [authToken, userId, navigate]);

    const handlePurchase = async () => {
        if (!authToken || !userId) {
            toast.error("Користувач не авторизований.");
            return;
        }

        const orderData = {
            userId: userId,
            items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await axios.post("http://localhost:5131/api/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 201 || response.status === 204) {
                clearCart();
                localStorage.removeItem("cartItems");
                toast.success("Замовлення успішно оформлено!");
                navigate("/products");
            } else {
                toast.error("Не вдалося оформити замовлення. Будь ласка, спробуйте ще раз.");
            }
        } catch (error) {
            console.error("Помилка при оформленні замовлення:", error);
            toast.error("Сталася помилка під час оформлення замовлення.");
        }
    };

    return (
        <div className="cart-container">
            <h2 className="text-center mb-4">Ваш кошик</h2>
            {cartItems.length === 0 ? (
                <p className="text-center">Кошик порожній</p>
            ) : (
                <div>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item card shadow-sm mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/150"}
                                            alt={item.name}
                                            className="img-fluid rounded-start"
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text">Ціна: {item.price}₴</p>
                                            <div className="d-flex align-items-center">
                                                <label htmlFor={`quantity-${item.id}`} className="me-2">
                                                    Кількість:
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`quantity-${item.id}`}
                                                    className="form-control quantity-input me-3"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) =>
                                                        updateQuantity(item.id, parseInt(e.target.value, 10))
                                                    }
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary text-center">
                        <h3 className="mt-4">Загальна сума: {getTotalPrice()}₴</h3>
                        <button className="btn btn-success mt-3 w-100" onClick={handlePurchase}>
                            Оформити замовлення
                        </button>
                        <button
                            className="btn btn-outline-danger mt-3 w-100"
                            onClick={clearCart}
                        >
                            Очистити кошик
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
