import express from 'express';
import { customerController } from '../controllers/customerController.js';

const router = express.Router();

// Customer Routes - Only 4 basic APIs
router.get('/customers', customerController.getAllCustomers);
router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

export default router; 