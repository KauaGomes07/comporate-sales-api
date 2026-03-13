import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkCompanyProduct } from '../middlewares/checkCompanyProducts';

const productRoutes = Router()

productRoutes.post("/", authMiddleware, createProduct)
productRoutes.get("/", authMiddleware, getProducts)
productRoutes.put("/:id", authMiddleware, checkCompanyProduct, updateProduct)
productRoutes.delete("/:id", authMiddleware, checkCompanyProduct, deleteProduct)

export { productRoutes }