import express from "express"
import adminAuth from "../middleware/adminAuth.js"
import { allOrders, placeOrder, UpdateStatus, userOrders } from "../controllers/orderController.js"
import authUser from "../middleware/auth.js"

const orderRouter = express.Router()

// Para Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, UpdateStatus)

// Para Pedido
orderRouter.post('/place', authUser, placeOrder)

// Para Usuário
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter