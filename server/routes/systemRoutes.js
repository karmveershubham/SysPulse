// routes/systemRoutes.js
import express from 'express';
import {
  registerSystem,
  reportSystem,
  getSystems,
} from '../controllers/systemController.js';

const router = express.Router();

router.post('/register', registerSystem);
router.post('/report', reportSystem);
router.get('/', getSystems);

export default router;
