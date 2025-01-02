import React from "react";
import { useProducts } from "./ProductContext";
import { Link } from "react-router-dom";

const ProductsList = () => {
    const { products, loading } = useProducts();

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Список товарів</h2>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            {/* Вставляємо картинку товару */}
                            <img
                                src={product.imageUrl || "https://m.media-amazon.com/images/I/61WditpPznL.jpg"} // Використовуємо надану картинку як дефолтну
                                alt={product.name}
                                className="card-img-top"
                                style={{ width: "100%", height: "150px", objectFit: "cover" }} // Зменшуємо розмір картинки
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    <strong>Ціна:</strong> {product.price}₴
                                </p>
                                <p className="card-text">
                                    <strong>Кількість в наявності:</strong> {product.stockQuantity} одиниць
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
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
