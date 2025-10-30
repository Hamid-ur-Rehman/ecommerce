"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../users/guards/roles.guard");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const role_entity_1 = require("../users/entities/role.entity");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    getRecentOrders(limit) {
        return this.adminService.getRecentOrders(limit);
    }
    getTopSellingProducts(limit) {
        return this.adminService.getTopSellingProducts(limit);
    }
    getLowStockProducts() {
        return this.adminService.getLowStockProducts();
    }
    getOrderStatusDistribution() {
        return this.adminService.getOrderStatusDistribution();
    }
    getPaymentStatusDistribution() {
        return this.adminService.getPaymentStatusDistribution();
    }
    getMonthlyRevenue(year) {
        return this.adminService.getMonthlyRevenue(year);
    }
    getUserGrowth(months) {
        return this.adminService.getUserGrowth(months);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin/Moderator access required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('recent-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent orders (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent orders retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentOrders", null);
__decorate([
    (0, common_1.Get)('top-selling-products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top selling products (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top selling products retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTopSellingProducts", null);
__decorate([
    (0, common_1.Get)('low-stock-products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock products (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Low stock products retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLowStockProducts", null);
__decorate([
    (0, common_1.Get)('order-status-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order status distribution (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status distribution retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOrderStatusDistribution", null);
__decorate([
    (0, common_1.Get)('payment-status-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment status distribution (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment status distribution retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPaymentStatusDistribution", null);
__decorate([
    (0, common_1.Get)('monthly-revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly revenue data (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monthly revenue data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number, example: 2024 }),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMonthlyRevenue", null);
__decorate([
    (0, common_1.Get)('user-growth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user growth data (Admin/Moderator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User growth data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'months', required: false, type: Number, example: 12 }),
    __param(0, (0, common_1.Query)('months')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUserGrowth", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map