import express from 'express'
import { registerChild } from '../controllers/childController.js'

const router = express.Router()

// Define the route for registering a child
router.post('/register', registerChild)

export default router
