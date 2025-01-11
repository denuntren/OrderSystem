import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useProducts } from "./ProductContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, userId, authToken } = useCart();
    const { fetchProducts } = useProducts();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

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

            if (error.response?.status === 401) {
                toast.error("Ви не авторизовані. Будь ласка, увійдіть у систему.");
            } else {
                toast.error(`Помилка під час оформлення замовлення: ${error.message}`);
            }
        }
    };

    return (
        <div>
            <h2>Ваш кошик</h2>
            {cartItems.length === 0 ? (
                <p>Кошик порожній</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div key={item.id} className="d-flex align-items-center mb-3">
                            <p className="me-3">{item.name}</p>
                            <p className="me-3">{item.price}₴</p>
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) =>
                                    updateQuantity(item.id, parseInt(e.target.value, 10))
                                }
                            />
                            <button
                                className="btn btn-danger ms-3"
                                onClick={() => removeFromCart(item.id)}
                            >
                                Видалити
                            </button>

                        </div>
                    ))}
                    <h3>Загальна сума: {getTotalPrice()}₴</h3>
                    <button className="btn btn-success mt-3" onClick={handlePurchase}>
                        Оформити замовлення
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;
