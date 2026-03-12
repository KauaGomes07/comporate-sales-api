import { Router } from 'express';
import { createProduct } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';

const productRoutes = Router()

productRoutes.post("/create", authMiddleware, createProduct)

export { productRoutes }