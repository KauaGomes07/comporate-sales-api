import { Router } from "express"
import { authRoutes } from "./authRoutes"
import { companyRoutes } from "./companyRoutes"
import { productRoutes } from "./productRoutes"
import { orderRoutes } from "./orderRoutes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/companies", companyRoutes)
router.use("/products", productRoutes)
router.use("/orders", orderRoutes)

export { router }