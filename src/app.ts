import express from "express"
import cors from "cors"
import { router } from "./routes"
import { swaggerRouter } from "./swagger"

const app = express()

app.use(cors())
app.use(express.json())

app.use(swaggerRouter)
app.use(router)

export { app }