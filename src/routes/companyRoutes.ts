import { Router } from "express"
import { createCompany, getCompanyProducts, getMyCompany, updateCompany } from "../controllers/companyController"
import { authMiddleware } from "../middlewares/authMiddleware"

const companyRoutes = Router()

companyRoutes.post("/my-company", authMiddleware, createCompany)

companyRoutes.get("/", authMiddleware, getMyCompany)

companyRoutes.get("/:id/products", authMiddleware, getCompanyProducts)

companyRoutes.put("/my-company", authMiddleware, updateCompany)

export { companyRoutes }