import express from 'express';
import {
  createBarterRequest,
  getBarterRequests,
  getBarterRequestById,
  acceptBarterRequest,
  rejectBarterRequest,
  completeBarterRequest
} from '../controllers/barterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBarterRequest);
router.get('/', protect, getBarterRequests);
router.get('/:id', protect, getBarterRequestById);
router.put('/:id/accept', protect, acceptBarterRequest);
router.put('/:id/reject', protect, rejectBarterRequest);
router.put('/:id/complete', protect, completeBarterRequest);

export default router;
