import express from 'express';
import clientAuth from '../middlewares/clientAuth.js';
import adminAuth from '../middlewares/adminAuth.js';
import { createOrder, cancelOrder, changeOrderStatus } from '../controllers/mutations/order.mutation.js';
import { getAllOrdersByStatus, getAllOrdersByStatusClient } from '../controllers/queries/order.queries.js';

const orderRouter = express.Router();

orderRouter.post('/create', clientAuth,  createOrder)
orderRouter.put('/cancel', clientAuth,  cancelOrder)
orderRouter.get('/client', clientAuth, getAllOrdersByStatusClient)

orderRouter.put('/status', adminAuth, changeOrderStatus)
orderRouter.get('/admin', adminAuth, getAllOrdersByStatus)


export default orderRouter;

