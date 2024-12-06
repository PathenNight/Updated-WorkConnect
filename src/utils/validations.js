// Check if a string is a valid email address
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Check if a string meets the password requirements
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one letter, one number
    return passwordRegex.test(password);
  };
  
  // Check if a string is not empty or just spaces
  export const validateNotEmpty = (value) => {
    return value.trim().length > 0;
  };
  
  // Check if an object has all required fields
  export const validateRequiredFields = (fields, requiredFields) => {
    const errors = {};
    requiredFields.forEach((field) => {
      if (!validateNotEmpty(fields[field])) {
        errors[field] = `${field} is required.`;
      }
    });
    return errors;
  };
  
  // Validate a recovery key format (16 alphanumeric characters)
  export const validateRecoveryKey = (key) => {
    const recoveryKeyRegex = /^[A-Za-z\d]{16}$/;
    return recoveryKeyRegex.test(key);
  };
  
  // Validate the entire form
  export const validateForm = (formData, rules) => {
    const errors = {};
    Object.keys(rules).forEach((field) => {
      const rule = rules[field];
      if (!rule.test(formData[field])) {
        errors[field] = rule.errorMessage;
      }
    });
    return errors;
  };
  
  // Example usage of validateForm for user registration
  export const validateRegistrationForm = (formData) => {
    return validateForm(formData, {
      name: {
        test: validateNotEmpty,
        errorMessage: "Name is required.",
      },
      email: {
        test: validateEmail,
        errorMessage: "Invalid email format.",
      },
      password: {
        test: validatePassword,
        errorMessage: "Password must be at least 8 characters long and contain one letter and one number.",
      },
    });
  };
  