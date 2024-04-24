import bcrypt from "bcrypt";

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (err) {
        console.log(err);
    }
};

export default hashData;
