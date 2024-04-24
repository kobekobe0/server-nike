const sendPayment = async (req, res, next) => {
    try {
        req.status = "paid";
        next();
    } catch (err) {}
};

export default sendPayment;
