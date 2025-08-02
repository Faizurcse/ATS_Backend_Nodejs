import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Customer Controller with only 4 basic APIs
const customerController = {
  // Get all customers
  getAllCustomers: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        priority, 
        industry,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      
      // Build where clause
      const where = {};
      if (search) {
        where.OR = [
          { companyName: { contains: search, mode: 'insensitive' } },
          { industry: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (industry) where.industry = industry;

      // Get customers
      const customers = await prisma.customer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: parseInt(skip),
        take: parseInt(limit)
      });

      // Get total count for pagination
      const total = await prisma.customer.count({ where });
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message
      });
    }
  },

  // Create new customer (internal/external)
  createCustomer: async (req, res) => {
    try {
      const {
        companyName,
        industry,
        companySize,
        website,
        description,
        status,
        priority,
        country,
        city,
        address,
        annualRevenue,
        contractValue,
        billingCycle
      } = req.body;

      // Validate required fields
      if (!companyName || !industry || !country || !city) {
        return res.status(400).json({
          success: false,
          message: 'Company name, industry, country, and city are required'
        });
      }

      const customer = await prisma.customer.create({
        data: {
          companyName,
          industry,
          companySize,
          website,
          description,
          status: status || 'ACTIVE',
          priority: priority || 'MEDIUM',
          country,
          city,
          address,
          annualRevenue,
          contractValue: contractValue ? parseFloat(contractValue) : null,
          billingCycle
        }
      });

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message
      });
    }
  },

  // Update customer
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const customer = await prisma.customer.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message
      });
    }
  },

  // Delete customer
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.customer.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message
      });
    }
  }
};

export { customerController }; 