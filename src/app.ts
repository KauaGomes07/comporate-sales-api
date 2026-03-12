import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/authRoutes'
import { productRoutes } from './routes/productRoutes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use("/product", productRoutes)

export default app