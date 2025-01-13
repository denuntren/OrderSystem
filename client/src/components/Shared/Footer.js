﻿import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-5">
            <p>&copy; {new Date().getFullYear()} Магазин у Дениса. Всі права захищені.</p>
            <p>
                <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" className="text-light">
                    Портфоліо
                </a>
            </p>
        </footer>
    );
};

export default Footer;