import { Router } from 'express';
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes);

module.exports = router;
