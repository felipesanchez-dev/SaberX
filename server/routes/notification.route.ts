import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { getNotifications, updateNotifications } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/get-all-notifications', isAuthenticated, authorizeRoles('admin'), getNotifications);

notificationRouter.put('/update-notifications/:id', isAuthenticated, authorizeRoles('admin'), updateNotifications);


export default notificationRouter;