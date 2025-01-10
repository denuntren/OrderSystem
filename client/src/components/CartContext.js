import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Створення контексту для кошика
const CartContext = createContext();

// Хук для доступу до контексту
export const useCart = () => useContext(CartContext);

// Провайдер контексту кошика
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem("UserId"));
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

    useEffect(() => {
        const storedAuthToken = localStorage.getItem("authToken");
        const storedUserId = localStorage.getItem("UserId");

        if (storedAuthToken && !userId) {
            const decodedToken = JSON.parse(atob(storedAuthToken.split('.')[1]));
            const newUserId = decodedToken.sub;
            setAuthToken(storedAuthToken);
            setUserId(newUserId);
            localStorage.setItem("UserId", newUserId);
        }
    }, [userId, authToken]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Очищення кошика
    const clearCart = () => {
        setCartItems([]);
    };

    const purchaseCart = async (orderData) => {
        if (!authToken) {
            toast.error("Ви не авторизовані. Будь ласка, увійдіть у систему.");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Кошик порожній. Додайте товари перед покупкою.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5131/api/orders",
                { ...orderData, UserId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Замовлення успішно оформлено!");
                clearCart();
            } else {
                toast.error("Не вдалося оформити замовлення. Спробуйте ще раз.");
            }
        } catch (error) {
            console.error("Помилка оформлення замовлення:", error);
            toast.error("Помилка під час оформлення замовлення.");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                purchaseCart,
                userId,
                authToken,
                setUserId,
                setAuthToken,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
