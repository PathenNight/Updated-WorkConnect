import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';
import SecurityQuestionDropdown from '../components/SecurityQuestionDropdown';

function CreateUser() {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [OrganizationName, setOrganizationName] = useState('');
    const [SecurityQuestion, setSecurityQuestion] = useState('');
    const [SecurityAnswer, setSecurityAnswer] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isAccountCreated, setIsAccountCreated] = useState(false);

    const navigate = useNavigate();

    // Redirects to the login page
    const navigateHome = () => {
        navigate('/');
    };

    // Validates the form fields
    const validateForm = () => {
        const newErrors = {};
        if (!Name) newErrors.Name = 'Name is required.';
        if (!Email) newErrors.Email = 'Email is required.';
        if (!Password) newErrors.Password = 'Password is required.';
        if (!OrganizationName) newErrors.OrganizationName = 'Organization Name is required.';
        if (!SecurityQuestion) newErrors.SecurityQuestion = 'Please select a security question.';
        if (!SecurityAnswer) newErrors.SecurityAnswer = 'Answer to the security question is required.';
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handles security question selection
    const handleSecurityQuestionChange = (question) => {
        setSecurityQuestion(question);
    };

    // Submits the form and creates a user
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Split Name into firstName and lastName
                const [firstName, ...rest] = Name.split(' ');
                const lastName = rest.join(' ') || '';
    
                // Debug: Log the data being sent to the backend
                console.log('Sending data:', {
                    email: Email,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    password: Password,
                    securityQuestion: SecurityQuestion,
                    securityAnswer: SecurityAnswer,
                    role: 'employee', // Default role, if applicable
                });
    
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/auth/register`,
                    {
                        email: Email,
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        password: Password,
                        securityQuestion: SecurityQuestion,
                        securityAnswer: SecurityAnswer,
                        role: 'employee', // Default role, if applicable
                    }
                );
    
                console.log('Response:', response.data); // Debug: Log the backend response
                setSuccessMessage(`Account created successfully!`);
                setIsAccountCreated(true);
                setName('');
                setEmail('');
                setPassword('');
                setOrganizationName('');
                setSecurityQuestion('');
                setSecurityAnswer('');
            } catch (err) {
                console.error('Error creating user:', err.response || err);
    
                // Debug: Log detailed error information
                if (err.response) {
                    console.log('Backend error details:', err.response.data);
                }
    
                setErrors({
                    server: err.response?.data?.message || 'Failed to create user. Please try again later.',
                });
            }
        }
    };
    
    // Returns to the login page
    const handleReturnToLogin = () => {
        navigate('/');
    };

    return (
        <div className="login-form">
            {!isAccountCreated ? (
                <form className="create-form" onSubmit={handleSubmit}>
                    <img
                        src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
                        alt="WorkConnect logo"
                        className="favicon-image"
                        onClick={navigateHome}
                    />
                    <h2>Create Your Account</h2>
                    {errors.server && <div className="error-message">{errors.server}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                        {errors.Name && <span className="error">{errors.Name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        {errors.Email && <span className="error">{errors.Email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        {errors.Password && <span className="error">{errors.Password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="orgName">Organization Name</label>
                        <input
                            type="text"
                            id="orgName"
                            value={OrganizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="Organization Name"
                        />
                        {errors.OrganizationName && <span className="error">{errors.OrganizationName}</span>}
                    </div>
                    <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestionChange} />
                    <div className="form-group">
                        <label htmlFor="securityAnswer">Security Question Answer</label>
                        <input
                            type="text"
                            id="securityAnswer"
                            value={SecurityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Enter your answer"
                        />
                        {errors.SecurityAnswer && <span className="error">{errors.SecurityAnswer}</span>}
                    </div>
                    <button type="submit" className="btn-primary btn-margin-top">
                        Create Account
                    </button>
                </form>
            ) : (
                <div className="success-container">
                    <div className="success-message">
                        <img
                            src={`${process.env.PUBLIC_URL}/favicon.png`}
                            alt="WorkConnect logo"
                            className="favicon-image"
                        />
                        <h1 className="recovery-message">Account Created Successfully!</h1>
                        <p className="recovery-message">Please retain your credentials for future login.</p>
                        <button className="btn-primary" onClick={handleReturnToLogin}>
                            Return to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateUser;
