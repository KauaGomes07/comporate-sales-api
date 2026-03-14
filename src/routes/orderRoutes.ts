import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController"

const orderRoutes = Router()

orderRoutes.post("/", authMiddleware, createOrder)

orderRoutes.get("/my", authMiddleware, getMyOrders)

orderRoutes.get("/:id", authMiddleware, getOrderById)

export { orderRoutes }

