import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Recovery.css";

function RecoveryPage() {
    const [hasRecoveryKey, setHasRecoveryKey] = useState(null);
    const [recoveryKey, setRecoveryKey] = useState("");
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error
        setSuccessMessage(""); // Clear previous success message

        if (hasRecoveryKey === null) {
            setError("Please select if you have your recovery key.");
            return;
        }

        try {
            if (hasRecoveryKey) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/recover-by-key`, { recoveryKey: recoveryKey.trim() });
                if (response.data.found) {
                    setSuccessMessage(`Account found! Your email is: ${response.data.email}.`);
                } else {
                    setError("No account found with this recovery key.");
                }
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/recover-by-email`, { email: email.trim() });
                if (response.data.found) {
                    setSecurityQuestion(response.data.securityQuestion);
                } else {
                    setError("No account found with this email.");
                }
            }
        } catch (err) {
            setError("Error recovering account. Please try again.");
        }
    };

    const handleSecurityAnswerSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error
        setSuccessMessage(""); // Clear previous success message

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-answer`, {
                email: email.trim(),
                answer: securityAnswer.trim(),
            });

            if (response.data.correct) {
                setSuccessMessage("Account verified successfully! You can now reset your password.");
            } else {
                setError("Incorrect answer. Please contact support for assistance.");
            }
        } catch (err) {
            setError("Error verifying answer. Please try again.");
        }
    };

    return (
        <div className="login-form">
            <img
                src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
                alt="WorkConnect logo"
                style={{ width: "150px", height: "120px" }}
                className="favicon-image"
                onClick={navigateHome}
            />
            <h2>Account Recovery</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="create-form">
                {hasRecoveryKey === null && (
                    <div className="form-group">
                        <label>Do you have a recovery key?</label>
                        <button
                            type="button"
                            onClick={() => setHasRecoveryKey(true)}
                            className="btn-option-yes"
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => setHasRecoveryKey(false)}
                            className="btn-option-no"
                        >
                            No
                        </button>
                    </div>
                )}

                {hasRecoveryKey && (
                    <div className="form-group">
                        <label htmlFor="recoveryKey">Enter Your Recovery Key</label>
                        <input
                            type="text"
                            id="recoveryKey"
                            value={recoveryKey}
                            onChange={(e) => setRecoveryKey(e.target.value)}
                            placeholder="Enter your recovery key"
                        />
                    </div>
                )}

                {!hasRecoveryKey && hasRecoveryKey !== null && (
                    <div className="form-group">
                        <label htmlFor="email">Enter Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                )}

                {hasRecoveryKey !== null && (
                    <button className="btn-primary" type="submit">
                        Submit
                    </button>
                )}
            </form>

            {securityQuestion && (
                <form onSubmit={handleSecurityAnswerSubmit} className="create-form">
                    <div className="form-group">
                        <label>{securityQuestion}</label>
                        <input
                            type="text"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Enter your answer"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Verify Answer
                    </button>
                </form>
            )}
        </div>
    );
}

export default RecoveryPage;
