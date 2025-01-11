import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Завантажуємо кошик із localStorage або створюємо порожній масив
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [userId, setUserId] = useState(localStorage.getItem("UserId") || null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

    // Зберігаємо кошик у localStorage при зміні
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Синхронізуємо userId та authToken з localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setAuthToken(localStorage.getItem("authToken"));
            setUserId(localStorage.getItem("UserId"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

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
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cartItems"); // Очищаємо localStorage
    };

    const purchaseCart = async (orderData) => {
        if (!authToken || !userId) {
            toast.error("Користувач не авторизований.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5131/api/orders",
                { ...orderData, userId },
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
                toast.error("Не вдалося оформити замовлення.");
            }
        } catch (error) {
            toast.error("Помилка при оформленні замовлення.");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
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
