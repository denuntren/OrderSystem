import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";

const Header = ({ authToken, userRole, handleLogout }) => {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    return (
        <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
            <h1 className="m-0" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                Den's shop
            </h1>
            <nav>
                {authToken ? (
                    <div className="d-flex align-items-center">
                        {userRole === "Admin" && (
                            <Link to="/admin/orders" className="btn btn-light me-3">
                                Замовлення (Admin)
                            </Link>
                        )}
                        <Link to="/products" className="btn btn-light me-3">
                            Продукти
                        </Link>
                        <Link to="/cart" className="btn btn-light me-3">
                            Кошик ({cartItems.length})
                        </Link>
                        <Link to="/orders" className="btn btn-light me-3">
                            Замовлення
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Вийти
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" className="btn btn-light me-3">
                            Вхід
                        </Link>
                        <Link to="/register" className="btn btn-light">
                            Реєстрація
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
