import express from 'express';
import {
  getStats,
  listUsers,
  deleteUser,
  promoteUser,
  listAllTrips,
  adminPopularCities,
  adminPopularActivities,
  tripsPerMonth,
  tripStatusDistribution,
  userSignupsOverTime,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/promote', promoteUser);
router.get('/trips', listAllTrips);
router.get('/cities/popular', adminPopularCities);
router.get('/activities/popular', adminPopularActivities);
router.get('/analytics/trips-per-month', tripsPerMonth);
router.get('/analytics/trip-status', tripStatusDistribution);
router.get('/analytics/signups', userSignupsOverTime);

export default router;
