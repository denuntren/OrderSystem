import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProducts } from "./ProductContext";

const EditProductForm = ({ authToken }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, setProducts } = useProducts();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
    });

    useEffect(() => {
        const currentProduct = products.find((p) => p.id === parseInt(id));
        if (currentProduct) {
            setProduct(currentProduct);
        } else {
            axios
                .get(`http://localhost:5131/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                })
                .then((response) => {
                    setProduct(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching product:", error);
                });
        }
    }, [id, products, authToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(
                `http://localhost:5131/api/products/${id}`,
                {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stockQuantity: product.stockQuantity,
                    imageUrl: product.imageUrl,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            )
            .then(() => {
                const updatedProducts = products.map((p) =>
                    p.id === parseInt(id) ? { ...p, ...product } : p
                );
                setProducts(updatedProducts);
                navigate("/products");
            })
            .catch((error) => {
                console.error("Error updating product:", error);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Редагувати товар</h2>
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Назва
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Опис
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={product.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        Ціна
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="stockQuantity" className="form-label">
                        Кількість
                    </label>
                    <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        className="form-control"
                        value={product.stockQuantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                        URL зображення
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        value={product.imageUrl}
                        onChange={handleChange}
                    />
                    {product.imageUrl && (
                        <div className="mt-3 text-center">
                            <img
                                src={product.imageUrl}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{
                                    maxWidth: "300px",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Оновити товар
                </button>
            </form>
        </div>
    );
};

export default EditProductForm;
