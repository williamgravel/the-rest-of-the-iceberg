// PACKAGE IMPORTS
import express from 'express'
const router = express.Router()

// ROUTE IMPORTS
import apiRouter from './api.js'
import authRouter from './auth.js'

// SETUP ROUTES
router.use('/api', apiRouter)
router.use('/auth', authRouter)

export default router
