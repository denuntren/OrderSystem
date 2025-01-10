import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ProductsList from "./components/ProductsList";
import EditProductForm from "./components/EditProductForm";
import ProductDetail from "./components/ProductDetail";
import { ProductsProvider } from "./components/ProductContext";
import AddProduct from "./components/AddProductForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import { toast } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider, useCart } from "./components/CartContext";
import Orders from "./components/Orders";

const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [userId, setUserId] = useState(localStorage.getItem("UserId"));
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    useEffect(() => {
        const storedAuthToken = localStorage.getItem("authToken");

        if (storedAuthToken) {
            try {
                const decodedToken = JSON.parse(atob(storedAuthToken.split(".")[1]));
                const newUserId = decodedToken.sub;
                setAuthToken(storedAuthToken);
                setUserId(newUserId);
                localStorage.setItem("UserId", newUserId);
            } catch (error) {
                console.error("Invalid token");
                handleLogout();
            }
        } else {
            setAuthToken(null);
            setUserId(null);
        }
    }, []);

    const fetchCartData = () => {
        console.log("Fetching cart data...");
    };

    const fetchProducts = () => {
        console.log("Fetching product data...");
    };

    const navigateToCart = () => {
        navigate("/cart");
        fetchCartData();
    };

    const navigateToProducts = () => {
        navigate("/products");
        fetchProducts();
    };

    const handleLogin = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
        fetchProducts();
        navigate("/products");
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("UserId");

        setAuthToken(null);
        setUserId(null);
        clearCart();

        toast.success("Ви успішно вийшли з системи!");
        navigate("/login");
    };

    return (
        <CartProvider>
            <ProductsProvider authToken={authToken}>
                <div className="container mt-4">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <header className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-primary">{authToken ? "Магазин" : "Вхід до системи"}</h2>
                        {authToken && (
                            <div>
                                {location.pathname === "/cart" ? (
                                    <button
                                        onClick={navigateToProducts}
                                        className="btn btn-secondary btn-sm me-2"
                                    >
                                        Повернутись до списку товарів
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={navigateToCart}
                                            className="btn btn-secondary btn-sm me-2"
                                        >
                                            Перейти до кошика
                                        </button>
                                        <button
                                            onClick={() => navigate("/orders")}
                                            className="btn btn-info btn-sm me-2"
                                        >
                                            Ваші замовлення
                                        </button>
                                    </>
                                )}
                                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                    Вийти
                                </button>
                            </div>
                        )}
                    </header>

                    <Routes>
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route
                        path="/products/edit/:id"
                        element={<EditProductForm authToken={authToken} />}
                    />
                    <Route path="/products/detail/:id" element={<ProductDetail />} />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={authToken ? <ProductsList /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            authToken ? (
                                <Navigate to="/products" replace />
                            ) : (
                                <LoginForm setAuthToken={handleLogin} />
                            )
                        }
                    />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                        path="/"
                        element={authToken ? <ProductsList /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
            </ProductsProvider>
        </CartProvider>
    );
};

export default App;
