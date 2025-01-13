import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "./ProductContext";

const ProductDetail = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="text-center mt-5">
                <h2 className="text-danger">Товар не знайдено</h2>
                <Link to="/products" className="btn btn-primary mt-3">
                    Назад до списку товарів
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product.imageUrl || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="text-primary mb-3">{product.name}</h2>
                    <p className="text-muted">{product.description}</p>
                    <hr />
                    <h4 className="text-success">Ціна: {product.price}₴</h4>
                    <h5 className="text-info">
                        Кількість в наявності: {product.stockQuantity} одиниць
                    </h5>
                    <hr />
                    <Link to="/products" className="btn btn-secondary btn-lg mt-3">
                        Назад до списку товарів
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
