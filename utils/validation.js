const validateInput = (fields) => {
    const errors = [];
    for (const [field, value] of Object.entries(fields)) {
        if (!value || value.trim() === '') {
            errors.push(`${field} is required.`);
        }
    }
    return errors;
};

module.exports = { validateInput };
