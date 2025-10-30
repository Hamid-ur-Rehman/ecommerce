import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { RoleName } from '../users/entities/role.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.MODERATOR)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Moderator access required' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Recent orders retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getRecentOrders(@Query('limit') limit?: number) {
    return this.adminService.getRecentOrders(limit);
  }

  @Get('top-selling-products')
  @ApiOperation({ summary: 'Get top selling products (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Top selling products retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getTopSellingProducts(@Query('limit') limit?: number) {
    return this.adminService.getTopSellingProducts(limit);
  }

  @Get('low-stock-products')
  @ApiOperation({ summary: 'Get low stock products (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully' })
  getLowStockProducts() {
    return this.adminService.getLowStockProducts();
  }

  @Get('order-status-distribution')
  @ApiOperation({ summary: 'Get order status distribution (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Order status distribution retrieved successfully' })
  getOrderStatusDistribution() {
    return this.adminService.getOrderStatusDistribution();
  }

  @Get('payment-status-distribution')
  @ApiOperation({ summary: 'Get payment status distribution (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Payment status distribution retrieved successfully' })
  getPaymentStatusDistribution() {
    return this.adminService.getPaymentStatusDistribution();
  }

  @Get('monthly-revenue')
  @ApiOperation({ summary: 'Get monthly revenue data (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'Monthly revenue data retrieved successfully' })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2024 })
  getMonthlyRevenue(@Query('year') year?: number) {
    return this.adminService.getMonthlyRevenue(year);
  }

  @Get('user-growth')
  @ApiOperation({ summary: 'Get user growth data (Admin/Moderator only)' })
  @ApiResponse({ status: 200, description: 'User growth data retrieved successfully' })
  @ApiQuery({ name: 'months', required: false, type: Number, example: 12 })
  getUserGrowth(@Query('months') months?: number) {
    return this.adminService.getUserGrowth(months);
  }
}
