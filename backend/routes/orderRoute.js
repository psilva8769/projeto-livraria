import express from "express"
import adminAuth from "../middleware/adminAuth.js"
import { allOrders, placeOrder, UpdateStatus, userOrders } from "../controllers/orderController.js"
import authUser from "../middleware/auth.js"

const orderRouter = express.Router()

// For Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, UpdateStatus)

// For Order
orderRouter.post('/place', authUser, placeOrder)

// For User
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter