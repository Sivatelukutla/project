import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './index.css';

const Category = () => {
    const [data, setdata] = useState({
        categoryName: "",
        Description: ""
    });

    const [check, isCheck] = useState(true);
    const [finalData, setData] = useState([]);

    
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("categories"));
        if (storedData) {
            setData(storedData);
        }
    }, []);

    
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(finalData));
    }, [finalData]);

    
    const categoryName = (event) => {
        const nameValue = event.target.value;
        const storedData = JSON.parse(localStorage.getItem("categories")) || [];

        const isUnique = !storedData.some(item => item.category_name.toLowerCase() === nameValue.toLowerCase());

        setdata({
            ...data,
            categoryName: nameValue
        });

        isCheck(isUnique);
    };

    
    const description = (event) => {
        const descriptionValue = event.target.value;
        setdata({
            ...data,
            Description: descriptionValue
        });
    };

    
    const submitData = (event) => {
        event.preventDefault();

        if (!check) {
            alert("Category name must be unique.");
            return;
        }
        
        const newData = {
            category_id: finalData.length + 1,
            category_name: data.categoryName,
            category_description: data.Description
        };

        setData((prev) => [...prev, newData]);
        setdata({ categoryName: "", Description: "" });
        isCheck(true);
    };

    
    const deleteItem = (id) => {
        const result = finalData.filter((item) => item.category_id !== id);
        setData(result);
    };

    return (
        <div className="container mt-5">
            <div className="row">

                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h1 className="text-center mb-4">Add New Category</h1>
                            <form onSubmit={submitData}>
                                <div className="mb-3">
                                    <label htmlFor="categoryName" className="form-label">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryName"
                                        className="form-control"
                                        placeholder="Enter category name"
                                        required
                                        onChange={categoryName}
                                        value={data.categoryName}
                                    />
                                    {!check && data.categoryName !== "" && (
                                        <p className='text-danger mt-1'>Please enter a unique category name</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        id="categoryDescription"
                                        className="form-control"
                                        placeholder="Enter category description"
                                        rows="5"
                                        required
                                        onChange={description}
                                        value={data.Description}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Add Category
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <h2 className="text-center mb-4 category-heading">Categories Table</h2>
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Category ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No data added</td>
                                </tr>
                            ) : (
                                finalData.map((item) => (
                                    <tr key={item.category_id}>
                                        <td>{item.category_id}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.category_description}</td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => deleteItem(item.category_id)}>Delete</button>
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

export default Category;
