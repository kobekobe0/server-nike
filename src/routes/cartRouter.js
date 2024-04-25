import express from 'express'
import clientAuth from '../middlewares/clientAuth.js'
import { addCartItem, removeCartItem, updateCartItem } from '../controllers/mutations/cart.mutation.js'
import { getCartItems } from '../controllers/queries/cart.queries.js'

const cartRouter = express.Router()

cartRouter.post('/', clientAuth, addCartItem )
cartRouter.delete('/', clientAuth, removeCartItem)
cartRouter.put('/', clientAuth, updateCartItem)
cartRouter.get('/', clientAuth, getCartItems)

export default cartRouter