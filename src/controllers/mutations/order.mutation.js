import Order from '../../models/Order.js'

export const createOrder = async (req, res) => {
    try {
        const {client} = req.user
        const {products, address} = req.body

        //check if products' quantity is available, product is only id

        const productItems = await Product.find({_id: {$in: products.id}})

        if (productItems.length !== products.length) {
            return res.status(400).json({error: 'Product not found'})
        }

        //update each TODO
        for (let i = 0; i < products.length; i++) {
            const product = productItems.find(item => item._id === products[i].id)
            if (!product) {
                return res.status(400).json({error: 'Product not found'})
            }

            if (product.quantity < products[i].quantity) {
                return res.status(400).json({error: 'Product quantity not available'})
            }

            product.quantity -= products[i].quantity
            await product.save()
        }


        const newOrder = await Order.create({
            client,
            products,
            address
        })

        if (!newOrder) {
            return res.status(400).json({error: 'Error creating order'})
        }

        res.status(201).json({data: newOrder})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const {id} = req.query
        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({error: 'Order not found'})
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({error: 'Order already cancelled'})
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, {status: 'cancelled'}, {new: true})

        res.status(200).json({data: updatedOrder})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


export const changeOrderStatus = async (req, res) => {
    try {
        const {id, status} = req.query
        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({error: 'Order not found'})
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, {status}, {new: true})

        res.status(200).json({data: updatedOrder})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

