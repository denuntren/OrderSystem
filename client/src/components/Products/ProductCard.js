import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="card" style={{ width: '18rem' }}>
            <div style={{height: "200px", overflow: "hidden"}}>
                <img
                    src={product.image || "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        maxHeight: "200px",
                    }}
                />
            </div>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                    <strong>Ціна:</strong> {product.price}₴
                </p>
                <button className="btn btn-primary">Додати в кошик</button>
            </div>
        </div>
    );
};

export default ProductCard;
