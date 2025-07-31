import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from "xlsx";
import './index.css';


const Products = () => {
    const [excelData, setExcelData] = useState([]);
    const [data, setDataForm] = useState({
        productName: "",
        categoryName: "",
        price: "",
        stock: ""
    });
    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();

    //     reader.onload = (event) => {
    //         const data = new Uint8Array(event.target.result);
    //         const workbook = XLSX.read(data, { type: "array" });

    //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //         setExcelData(jsonData);
    //     };

    //     reader.readAsArrayBuffer(file);
    // };

    const [check, isCheck] = useState(true);
    const [finalData, setData] = useState([]);


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("products"));
        if (storedData) {
            setData(storedData);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(finalData));
    }, [finalData]);

    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();

    //     reader.onload = (event) => {
    //         const data = new Uint8Array(event.target.result);
    //         const workbook = XLSX.read(data, { type: "array" });

    //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //         setExcelData(jsonData);
    //     };

    //     reader.readAsArrayBuffer(file);
    // };

    const productName = (event) => {
        const nameValue = event.target.value;
        setDataForm({
            ...data,
            productName: nameValue
        });
    };

    const categoryName = (event) => {
        const nameValue = event.target.value;
        const storedData = JSON.parse(localStorage.getItem("products")) || [];

        const isUnique = !storedData.some(item => item.category_name === nameValue);

        setDataForm({
            ...data,
            categoryName: nameValue
        });

        isCheck(isUnique);
    };

    const price = (event) => {
        const price = event.target.value;
        setDataForm({
            ...data,
            price: price
        });
    };

    const stock = (event) => {
        const stockValue = event.target.value;
        setDataForm({
            ...data,
            stock: stockValue
        });
    };

    const submitData = (event) => {
        event.preventDefault();

        const newData = {
            product_id: uuidv4(),
            product_name: data.productName,
            category_name: data.categoryName,
            price: data.price,
            stock: data.stock
        };

        setData((prev) => [...prev, newData]);
        setDataForm({
            productName: "",
            categoryName: "",
            price: "",
            stock: ""
        });
        isCheck(true);
    };

    const deleteItem = (id) => {
        const result = finalData.filter(item => item.product_id !== id);
        setData(result);
    };

    return (
        <div className="container mt-5">
            <div className="row">


                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h1 className="text-center mb-4">Add New Products</h1>
                            <form onSubmit={submitData}>
                                <div className='mt-5'>
                                    <label htmlFor='fileId' className="form-label">File Upload</label>
                                    <input type="file" accept='.xlsl, .xl' id="fileId" placeholder='upload file' className='form-control'/>
                                </div>
                                <div className="mb-3 mt-4">
                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        className="form-control"
                                        placeholder="Enter product name"
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
                                        placeholder="Enter category name"
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
                                        placeholder="Enter price"
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
                                        placeholder="Enter stock"
                                        required
                                        onChange={stock}
                                        value={data.stock}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Add Product
                                </button>
                            </form>
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No data added</td>
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
                                            <button className="btn btn-danger" onClick={() => deleteItem(item.product_id)}>
                                                Delete
                                            </button>
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
