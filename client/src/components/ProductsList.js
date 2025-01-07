import React, { useState } from "react";
import { useProducts } from "./ProductContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsList = () => {
    const { products, setProducts, loading } = useProducts();
    const [authToken] = useState(localStorage.getItem("authToken"));
    const [search, setSearch] = useState("");

    const handleDelete = (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
            return;
        }

        axios
            .delete(`http://localhost:5131/api/products/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            .then(() => {
                toast.success("Товар успішно видалено!");
                setProducts(products.filter((product) => product.id !== id));
            })
            .catch((error) => {
                toast.error("Товар не було видалено!");
                console.error("Не вдалося видалити товар:", error);
            });
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

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
                <Link to="/products/add" className="btn btn-success">
                    Додати новий товар
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Пошук товару..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <img
                                    src={
                                        product.imageUrl ||
                                        "https://m.media-amazon.com/images/I/61WditpPznL.jpg"
                                    }
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">
                                        <strong>Ціна:</strong> {product.price}₴
                                    </p>
                                    <p className="card-text">
                                        <strong>Кількість в наявності:</strong> {product.stockQuantity}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <Link
                                            to={`/products/detail/${product.id}`}
                                            className="btn btn-info btn-sm"
                                        >
                                            Деталі
                                        </Link>
                                        <Link
                                            to={`/products/edit/${product.id}`}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Редагувати
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
