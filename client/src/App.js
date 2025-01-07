import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import ProductsList from "./components/ProductsList";
import EditProductForm from "./components/EditProductForm";
import ProductDetail from "./components/ProductDetail";
import { ProductsProvider } from "../src/components/ProductContext";
import AddProduct from "./components/AddProductForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

    const handleLogin = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    };

    return (
        <Router>
            <ProductsProvider authToken={authToken}>
                <div className="container mt-4">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <header className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-primary">
                            {authToken ? "Магазин" : "Вхід до системи"}
                        </h2>
                        {authToken && (
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">
                                Вийти
                            </button>
                        )}
                    </header>

                    <Routes>
                        <Route path="/products/add" element={<AddProduct />} />
                        <Route path="/products/edit/:id" element={<EditProductForm authToken={authToken} />} />
                        <Route path="/products/detail/:id" element={<ProductDetail />} />

                        {}
                        <Route
                            path="/products"
                            element={authToken ? <ProductsList /> : <Navigate to="/login" replace />}
                        />

                        {}
                        <Route
                            path="/login"
                            element={authToken ? <Navigate to="/products" replace /> : <LoginForm setAuthToken={handleLogin} />}
                        />

                        <Route
                            path="/register"
                            element={<RegisterForm />}
                        />

                        <Route
                            path="/"
                            element={authToken ? <ProductsList /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </div>
            </ProductsProvider>
        </Router>
    );
};

export default App;
