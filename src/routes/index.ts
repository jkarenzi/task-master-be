import { Router } from 'express'
const authRoutes = require('./authRoutes')
const testRoutes = require('./testRoutes')
const stickyRoutes = require('./stickyRoutes')
const boardRoutes = require('./boardRoutes')
const categoryRoutes = require('./categoryRoutes')
const labelRoutes = require('./labelRoutes')
const taskRoutes = require('./taskRoutes')

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/sticky_notes', stickyRoutes)
router.use('/boards', boardRoutes)
router.use('/categories', categoryRoutes)
router.use('/labels', labelRoutes)
router.use('/tasks', taskRoutes)

module.exports = router;
