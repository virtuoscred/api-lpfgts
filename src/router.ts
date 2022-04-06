import express, { Request, Response, Router } from 'express'
import { createOrderController } from './controllers/orderController'
import { simulationController } from './controllers/simulationController'
const route = express.Router()


route.get('/saldo', simulationController)
route.post('/order', createOrderController)

export default route

