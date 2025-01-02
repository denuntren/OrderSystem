import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "./ProductContext";
import { Link } from "react-router-dom";

const ProductDetail = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return <p>Товар не знайдено.</p>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-4">{product.name}</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Опис:</h5>
                    <p className="card-text">{product.description}</p>
                    <h5 className="card-title">Ціна:</h5>
                    <p className="card-text">{product.price}₴</p>
                    <h5 className="card-title">Кількість в наявності:</h5>
                    <p className="card-text">{product.stockQuantity} одиниць</p>
                    <Link to="/products" className="btn btn-secondary">Назад до списку товарів</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
