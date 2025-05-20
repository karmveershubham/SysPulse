// routes/systemRoutes.js
import express from 'express';
import {
  registerSystem,
  reportSystem,
  getSystems,
  getReportByMachineId,
  getFilteredSystems
} from '../controllers/systemController.js';

const router = express.Router();

router.post('/register', registerSystem);
router.post('/report', reportSystem);
router.get('/', getSystems);
router.get('/:machine_id', getReportByMachineId);
router.get('/filters', getFilteredSystems);


export default router;
