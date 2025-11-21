import express from 'express';
import { 
  createSession, 
  getSessionByBarterId, 
  markUserReady, 
  completeSession,
  startMeetingInstance,
  endMeetingInstance
} from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSession);
router.get('/barter/:barterId', protect, getSessionByBarterId);
router.put('/:id/ready', protect, markUserReady);
router.put('/:id/start', protect, startMeetingInstance);
router.put('/:id/end', protect, endMeetingInstance);
router.put('/:id/complete', protect, completeSession);

export default router;
