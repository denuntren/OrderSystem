import React, { useState, useEffect } from "react";
import { useProducts } from "./ProductContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../Cart/CartContext";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import "./ProductList.css";

const ProductsList = () => {
    const { products, setProducts, loading } = useProducts();
    const authToken = localStorage.getItem("authToken");
    const [userRole, setUserRole] = useState(null);
    const [search, setSearch] = useState("");
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const { addToCart } = useCart();

    useEffect(() => {
        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUserRole(
                    decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                );
            } catch (error) {
                console.error("Помилка при розшифровці токена:", error);
            }
        }
    }, [authToken]);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        toast.success(`Товар "${product.name}" додано до кошика!`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5131/api/products/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            toast.success("Товар успішно видалено!");
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            toast.error("Товар не було видалено!");
            console.error("Не вдалося видалити товар:", error);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesPrice =
            product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesPrice;
    });

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Завантаження...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Список товарів</h2>
                {userRole === "Admin" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/products/add"
                            className="btn btn-success"
                        >
                            Додати новий товар
                        </Link>
                    </motion.div>
                )}
            </div>
            <div className="filter-container mb-4">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Пошук товару..."
                        className="form-control search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="price-range">
                    <input
                        type="number"
                        placeholder="Мін. ціна"
                        className="form-control price-input"
                        onChange={(e) =>
                            setPriceRange([+e.target.value || 0, priceRange[1]])
                        }
                    />
                    <span className="price-separator">-</span>
                    <input
                        type="number"
                        placeholder="Макс. ціна"
                        className="form-control price-input"
                        onChange={(e) =>
                            setPriceRange([priceRange[0], +e.target.value || Infinity])
                        }
                    />
                </div>
            </div>
            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className="col-md-4 mb-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card shadow-sm">
                                <img
                                    src={product.imageUrl || "https://via.placeholder.com/150"}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">
                                        <strong>Ціна:</strong> {product.price}₴
                                    </p>
                                    <p className="card-text">
                                        <strong>Кількість в наявності:</strong>{" "}
                                        {product.stockQuantity}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <Link
                                            to={`/products/detail/${product.id}`}
                                            className="btn btn-info btn-sm"
                                        >
                                            Деталі
                                        </Link>
                                        {userRole === "Admin" && (
                                            <>
                                                <Link
                                                    to={`/products/edit/${product.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Редагувати
                                                </Link>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Видалити
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="btn btn-primary mt-3 w-100"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Додати в кошик
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center">
                        <p>Товарів не знайдено.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsList;
