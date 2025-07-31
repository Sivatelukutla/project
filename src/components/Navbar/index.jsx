import { Link } from "react-router-dom";
import "./index.css";

const Navbar = () => {
    return (
        <nav className="nav-container">
            <div className="nav-links">
                <Link to="/category" className="nav-link">Category</Link>
                <Link to="/product" className="nav-link">Product</Link>
            </div>
        </nav>
    );
};

export default Navbar;