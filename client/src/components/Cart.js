import React from "react";
import { useCart } from "./CartContext";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <div>
            <h2>Ваш кошик</h2>
            {cartItems.length === 0 ? (
                <p>Кошик порожній</p>
            ) : (
                cartItems.map((item) => (
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
                ))
            )}
            <h3>Загальна сума: {totalPrice}₴</h3>
        </div>
    );
};

export default Cart;
