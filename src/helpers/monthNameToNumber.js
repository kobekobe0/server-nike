const monthNameToNumber = (monthName) => {
    const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const index = months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());

    return index !== -1 ? index + 1 : null;
};

export default monthNameToNumber;