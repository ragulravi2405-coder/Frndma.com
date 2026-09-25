import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  getDashboardStats,
  getAdminUsers,
  updateUserStatus,
  getAdminReports,
  updateReportStatus,
  getAdminPayments,
  getAdminPlans,
  saveAdminPlan,
  getAdminGirls,
  createAdminGirl,
  updateAdminGirl,
  deleteAdminGirl,
  syncDefaultGirls,
} from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/adminAuth';

const router = Router();

// Public admin auth
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Protected admin routes
router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/users', authenticateAdmin, getAdminUsers);
router.put('/users/:userId/status', authenticateAdmin, updateUserStatus);
router.get('/reports', authenticateAdmin, getAdminReports);
router.put('/reports/:reportId', authenticateAdmin, updateReportStatus);
router.get('/payments', authenticateAdmin, getAdminPayments);
router.get('/plans', authenticateAdmin, getAdminPlans);
router.post('/plans', authenticateAdmin, saveAdminPlan);

// 🌸 Girls Profiles Management Routes
router.get('/girls', authenticateAdmin, getAdminGirls);
router.post('/girls', authenticateAdmin, createAdminGirl);
router.put('/girls/:id', authenticateAdmin, updateAdminGirl);
router.delete('/girls/:id', authenticateAdmin, deleteAdminGirl);
router.post('/girls/sync', authenticateAdmin, syncDefaultGirls);

export default router;
