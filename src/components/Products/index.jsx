import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import './index.css';

const Products = () => {
    const [editIndex, setEditIndex] = useState(null);

    const [data, setDataForm] = useState({
        productName: "",
        categoryName: "",
        price: "",
        stock: ""
    });

    const [check, isCheck] = useState(true);
    const [finalData, setData] = useState([]);
    const [serialCounter, setSerialCounter] = useState(1);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("products"));
        if (storedData && storedData.length > 0) {
            setData(storedData);
            
            const maxId = Math.max(...storedData.map(p => p.product_id), 0);
            setSerialCounter(maxId + 1);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(finalData));
    }, [finalData]);

    const productName = (event) => {
        setDataForm({ ...data, productName: event.target.value });
    };

    const categoryName = (event) => {
        const nameValue = event.target.value;
        const storedData = JSON.parse(localStorage.getItem("products")) || [];

        const isUnique = !storedData.some(item => item.category_name === nameValue);

        setDataForm({ ...data, categoryName: nameValue });
        isCheck(isUnique || editIndex !== null); 
    };

    const price = (event) => {
        setDataForm({ ...data, price: event.target.value });
    };

    const stock = (event) => {
        setDataForm({ ...data, stock: event.target.value });
    };

    const submitData = (event) => {
        event.preventDefault();

        const updatedProduct = {
            product_id: editIndex ?? serialCounter,
            product_name: data.productName,
            category_name: data.categoryName,
            price: data.price,
            stock: data.stock
        };

        if (editIndex !== null) {
            const updatedData = finalData.map(item =>
                item.product_id === editIndex ? updatedProduct : item
            );
            setData(updatedData);
        } else {
            setData(prev => [...prev, updatedProduct]);
            setSerialCounter(prev => prev + 1);
        }

        setDataForm({ productName: "", categoryName: "", price: "", stock: "" });
        setEditIndex(null);
        isCheck(true);
    };

    const deleteItem = (id) => {
        const result = finalData.filter(item => item.product_id !== id);
        setData(result);
    };

    const editItem = (id) => {
        const productToEdit = finalData.find(item => item.product_id === id);
        if (productToEdit) {
            setDataForm({
                productName: productToEdit.product_name,
                categoryName: productToEdit.category_name,
                price: productToEdit.price,
                stock: productToEdit.stock
            });
            setEditIndex(id);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            
            const formattedData = data.map((item, index) => ({
                product_id: serialCounter + index,
                product_name: item.product_name || "",
                category_name: item.category_name || "",
                price: item.price || "",
                stock: item.stock || ""
            }));

            setData(prev => [...prev, ...formattedData]);
            setSerialCounter(prev => prev + formattedData.length);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="container mt-5">
            <div className="row d-flex flex-row justify-content-around">
                <div className='col-md-4'>
                    <div className='col-md-12'>
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h1 className="text-center mb-4">File Data</h1>
                                <div className='mt-5'>
                                    <label htmlFor='fileId' className="form-label lable-heading">File Upload</label>
                                    <input
                                        type="file"
                                        accept='.xlsx, .xls'
                                        id="fileId"
                                        className='form-control'
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mt-4">
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h1 className="text-center mb-4">{editIndex ? "Edit Product" : "Add Product"}</h1>
                                <form onSubmit={submitData}>
                                    <div className="mb-3">
                                        <label htmlFor="productName" className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            id="productName"
                                            className="form-control"
                                            required
                                            onChange={productName}
                                            value={data.productName}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            id="categoryName"
                                            className="form-control"
                                            required
                                            onChange={categoryName}
                                            value={data.categoryName}
                                        />
                                        {!check && (
                                            <p className='para text-danger mt-1'>Please enter a unique category name</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <input
                                            type="text"
                                            id="price"
                                            className="form-control"
                                            required
                                            onChange={price}
                                            value={data.price}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="stock" className="form-label">Stock</label>
                                        <input
                                            type="text"
                                            id="stock"
                                            className="form-control"
                                            required
                                            onChange={stock}
                                            value={data.stock}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-2">
                                        {editIndex ? "Update Product" : "Add Product"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <h2 className="text-center mb-4 category-heading">Products Table</h2>
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Category Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No data added</td>
                                </tr>
                            ) : (
                                finalData.map(item => (
                                    <tr key={item.product_id}>
                                        <td>{item.product_id}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => editItem(item.product_id)}>Edit</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => deleteItem(item.product_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
