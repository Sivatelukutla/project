import "./index.css";
import Navbar from "../Navbar";
import Category from "../Category";
import Products from "../Products";
import { Routes, Route } from 'react-router-dom';

const Main = () => {
    return (
        <div className="main-container">
            <div className="gradient-bg">
                <div className="grid-pattern"></div>
            </div>
            <Navbar />
            <div className="content-wrapper">
                <Routes>
                    <Route path="/category" element={<Category />} />
                    <Route path="/product" element={<Products />} />
                </Routes>
            </div>
        </div>
    );
};

export default Main;