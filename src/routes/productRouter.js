import express from 'express';
import {createProduct, deleteProduct, updateProduct, updateProductStatus} from '../controllers/mutations/product.mutation.js';
import {uploadImages, processImages} from '../middlewares/uploadImages.js';
import Product from '../models/Product.js';
import adminAuth from '../middlewares/adminAuth.js';
import { getAllProducts, getAllProductsClient, getProductById, getProductsByQuery } from '../controllers/queries/product.queries.js';

const productRouter = express.Router();

productRouter.post('/create', adminAuth, uploadImages, processImages, createProduct);
productRouter.put('/update', adminAuth, updateProduct)
productRouter.put('/delete', adminAuth, deleteProduct)
productRouter.put('/update-status', adminAuth, updateProductStatus)

productRouter.get('/all', adminAuth, getAllProducts)

productRouter.get('/all-client', getAllProductsClient)
productRouter.get('/product', getProductById)
productRouter.get('/products-query', getProductsByQuery)

export default productRouter;