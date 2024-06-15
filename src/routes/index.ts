import { Router } from 'express';
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');
const stickyRoutes = require('./stickyRoutes')

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/sticky_notes', stickyRoutes)

module.exports = router;
