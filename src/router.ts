import express, { Request, Response } from 'express'
import { createOrder, verifyAuthorizateFGTS } from './controllers/simulationController'
const route = express.Router()

route.get('/simulacao', verifyAuthorizateFGTS)
route.post('/order', createOrder)

export default route

