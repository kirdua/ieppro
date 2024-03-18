import express from 'express'
import {
  registerChild,
  getChildrenByParentId,
} from '../controllers/childController.js'

const router = express.Router()

// Define the route for registering a child
router.post('/register', registerChild)
router.get('/', getChildrenByParentId)

export default router
