import { Controller, Get, Post, Patch, Delete, Req, Res, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { User, PaymentType } from '@food-waste/types';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

interface AuthRequest extends Request {
  user?: User;
}

@Controller('users/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('methods')
  async getPaymentMethods(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      console.log('Getting payment methods for request:', {
        user: req.user,
        headers: req.headers,
      });

      const userId = req.user?.id;
      if (!userId) {
        console.error('No user ID found in request');
        return res.status(401).json({ message: 'Unauthorized - No user ID found' });
      }

      console.log('Fetching payment methods for user:', userId);
      const paymentMethods = await this.paymentsService.getPaymentMethods(userId);
      console.log('Found payment methods:', paymentMethods);

      res.json(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({ 
        message: 'Failed to fetch payment methods',
        error: error.message 
      });
    }
  }

  @Post('methods')
  async addPaymentMethod(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const userId = req.user?.id;
      console.log('Adding payment method for user:', {
        userId,
        user: req.user,
        body: req.body
      });

      if (!userId) {
        console.error('No user ID found in request');
        return res.status(401).json({ message: 'Unauthorized - No user ID found' });
      }

      const { type, cardNumber, expiryDate } = req.body;
      
      try {
        const paymentMethod = await this.paymentsService.addPaymentMethod(userId, {
          type: type as PaymentType,
          cardNumber,
          expiryDate
        });
        
        console.log('Successfully added payment method:', paymentMethod);
        res.status(201).json(paymentMethod);
      } catch (error) {
        console.error('Error in PaymentsService.addPaymentMethod:', {
          error,
          userId,
          type,
          cardNumber: cardNumber?.slice(-4),
          expiryDate
        });
        throw error;
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      const status = error instanceof NotFoundException ? 404 : 500;
      const message = error instanceof NotFoundException ? error.message : 'Failed to add payment method';
      res.status(status).json({ message });
    }
  }

  @Patch('methods/:id/default')
  async setDefaultPaymentMethod(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const paymentMethod = await this.paymentsService.setDefaultPaymentMethod(userId, id);
      res.json(paymentMethod);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      res.status(500).json({ message: 'Failed to set default payment method' });
    }
  }

  @Delete('methods/:id')
  async deletePaymentMethod(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await this.paymentsService.deletePaymentMethod(userId, id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({ message: 'Failed to delete payment method' });
    }
  }
}