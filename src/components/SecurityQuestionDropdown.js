import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import '../styles/SecurityQuestionDropdown.css'; // Import CSS for styling

const SecurityQuestionDropdown = ({ onQuestionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [questions, setQuestions] = useState([]);

    // Fetch security questions from the backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/security-questions`);
                setQuestions(response.data.questions); // Assuming backend returns a `questions` array
            } catch (error) {
                console.error('Error fetching security questions:', error);
            }
        };

        fetchQuestions();
    }, []); // Empty dependency array ensures it runs only once

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelectOption = (question) => {
        setSelectedOption(question);
        setIsOpen(false); // Close dropdown after selection
        if (onQuestionSelect) {
            onQuestionSelect(question); // Notify parent about selected question
        }
    };

    return (
        <div className="security-dropdown">
            <label htmlFor="securityQuestion">Select a security question:</label>
            <div
                className="dropdown"
                onClick={toggleDropdown}
                tabIndex={0} // Makes the dropdown focusable
            >
                {selectedOption || 'Select a question...'}
            </div>
            {isOpen && (
                <div className="dropdown-options">
                    {questions.map((question, index) => (
                        <div
                            key={index}
                            className={`dropdown-item ${
                                selectedOption === question ? 'selected-option' : ''
                            }`}
                            onClick={() => handleSelectOption(question)}
                        >
                            {question}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SecurityQuestionDropdown;
