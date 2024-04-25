import Cart from '../../models/Cart.js'

export const getCartItems = async (req, res) => {
    try {
        const {id} = req.user
        const cartItems = await Cart.find({client: id}).populate('product', 'name price')

        res.status(200).json({data: cartItems})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}