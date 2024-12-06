import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {
    const [formData, setFormData] = useState({ Name: "", Email: "", Password: "", OrganizationName: "" });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name) newErrors.Name = "Name is required.";
        if (!formData.Email) newErrors.Email = "Email is required.";
        if (!formData.Password) newErrors.Password = "Password is required.";
        if (!formData.OrganizationName) newErrors.OrganizationName = "Organization Name is required.";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        if (validateForm()) {
            try {
                const response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/auth/update/${id}`,
                    formData
                );
                console.log(response.data);
                navigate('/'); // Navigate to another page after successful update
            } catch (error) {
                console.error("Error updating user:", error.response || error);
                setErrors({ server: error.response?.data?.message || "Failed to update user. Please try again later." });
            }
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Update User</h2>

                    <div className="mb-3">
                        <label htmlFor="Name">
                            Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder="Enter your name"
                            className="form-control"
                            type="text"
                            id="Name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                        />
                        {errors.Name && <span className="text-danger">{errors.Name}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="Email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder="Enter your email address"
                            className="form-control"
                            type="email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                        />
                        {errors.Email && <span className="text-danger">{errors.Email}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="Password">
                            Password <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder="Enter your password"
                            className="form-control"
                            type="password"
                            id="Password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                        />
                        {errors.Password && <span className="text-danger">{errors.Password}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="OrganizationName">
                            Organization Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder="Enter the name of your organization"
                            className="form-control"
                            type="text"
                            id="OrganizationName"
                            name="OrganizationName"
                            value={formData.OrganizationName}
                            onChange={handleChange}
                        />
                        {errors.OrganizationName && <span className="text-danger">{errors.OrganizationName}</span>}
                    </div>

                    <button type="submit" className="btn btn-success w-100">Update</button>
                    {errors.server && (
                        <div className="text-danger mt-3">{errors.server}</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
