import express from 'express';
import { locationController } from '../controller/locationController.js';
import { isAuth, authorizeRoles } from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', locationController.getAllLocations);
router.get('/featured', locationController.getFeaturedLocations);
router.post('/', isAuth, authorizeRoles("admin"), locationController.createLocation);

export default router;
