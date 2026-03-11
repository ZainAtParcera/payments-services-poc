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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const merchant_dto_1 = require("./domain/dtos/merchant.dto");
const permissions_guard_1 = require("../auth/permissions.guard");
const permissions_decorator_1 = require("../auth/permissions.decorator");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async setupMerchant(parceraId, tenantId, dto) {
        return this.paymentsService.setupMerchant(parceraId, tenantId, dto);
    }
    async listMerchants(maxResults) {
        return this.paymentsService.listMerchants(maxResults);
    }
    async getMerchant(gatewayMerchantId) {
        try {
            return await this.paymentsService.getMerchant(gatewayMerchantId);
        }
        catch (err) {
            throw new common_1.NotFoundException(err.message);
        }
    }
    async updateMerchant(gatewayMerchantId, dto) {
        return this.paymentsService.updateMerchant(gatewayMerchantId, dto);
    }
    async deleteMerchant(gatewayMerchantId) {
        return this.paymentsService.deleteMerchant(gatewayMerchantId);
    }
    async updateMerchantStatus(gatewayMerchantId, dto) {
        return this.paymentsService.updateMerchantStatus(gatewayMerchantId, dto);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(':parceraId/setup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, permissions_decorator_1.Permissions)('payments_merchants.create'),
    (0, swagger_1.ApiOperation)({
        summary: 'Setup Merchant',
        description: 'Creates a merchant account with the configured payment provider, activates it, ' +
            'and returns the provider-assigned gateway ID. ' +
            'Requires permission: `payments_merchants.create`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'parceraId', description: 'Parcera merchant UUID', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: true, description: 'Tenant UUID', example: 'b1ffcd00-1c2b-4baf-9e6b-7cc8ce491b22' }),
    (0, swagger_1.ApiBody)({ type: merchant_dto_1.SetupMerchantDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Merchant account created and activated at the payment provider',
        schema: {
            example: {
                success: true,
                merchantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                gatewayId: 'nmi-1238420',
                gatewayAccountId: 'gwa-5432189',
                locationSpecific: false,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body or missing tenantId' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant or tenant not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.create' }),
    __param(0, (0, common_1.Param)('parceraId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('tenantId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, merchant_dto_1.SetupMerchantDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "setupMerchant", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('payments_merchants.list'),
    (0, swagger_1.ApiOperation)({
        summary: 'List Merchants',
        description: 'Retrieve a list of merchants from the configured payment provider. ' +
            'Requires permission: `payments_merchants.list`.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'maxResults', required: false, type: Number, example: 50, description: 'Max number of results to return' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant list returned successfully',
        schema: {
            example: {
                total: 2,
                maxResults: 50,
                merchants: [
                    { gatewayId: 'nmi-1238420', company: 'Simply South Restaurant', status: 'active' },
                    { gatewayId: 'nmi-1238421', company: 'Chai Point', status: 'active' },
                ],
            },
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.list' }),
    __param(0, (0, common_1.Query)('maxResults', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "listMerchants", null);
__decorate([
    (0, common_1.Get)(':gatewayMerchantId'),
    (0, permissions_decorator_1.Permissions)('payments_merchants.show'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Merchant',
        description: 'Fetch a single merchant by their provider-assigned gateway ID. ' +
            'Requires permission: `payments_merchants.show`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant details returned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found at the payment provider' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.show' }),
    __param(0, (0, common_1.Param)('gatewayMerchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMerchant", null);
__decorate([
    (0, common_1.Patch)(':gatewayMerchantId'),
    (0, permissions_decorator_1.Permissions)('payments_merchants.update'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Merchant',
        description: 'Update merchant details (name, address, contact) at the configured payment provider. ' +
            'Requires permission: `payments_merchants.update`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' }),
    (0, swagger_1.ApiBody)({ type: merchant_dto_1.UpdateMerchantDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found at the payment provider' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.update' }),
    __param(0, (0, common_1.Param)('gatewayMerchantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_dto_1.UpdateMerchantDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateMerchant", null);
__decorate([
    (0, common_1.Delete)(':gatewayMerchantId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.Permissions)('payments_merchants.delete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Merchant',
        description: 'Permanently delete a merchant account at the configured payment provider. ' +
            'Requires permission: `payments_merchants.delete`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found at the payment provider' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.delete' }),
    __param(0, (0, common_1.Param)('gatewayMerchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "deleteMerchant", null);
__decorate([
    (0, common_1.Patch)(':gatewayMerchantId/status'),
    (0, permissions_decorator_1.Permissions)('payments_merchants.update_status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Merchant Status',
        description: 'Update the operational status of a merchant (active | test | suspended | closed). ' +
            'Requires permission: `payments_merchants.update_status`.',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' }),
    (0, swagger_1.ApiBody)({ type: merchant_dto_1.UpdateMerchantStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Merchant status updated successfully',
        schema: { example: { id: '1238420', status: 'suspended', company: 'Simply South Restaurant' } },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found at the payment provider' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Missing permission: payments_merchants.update_status' }),
    __param(0, (0, common_1.Param)('gatewayMerchantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, merchant_dto_1.UpdateMerchantStatusDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateMerchantStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments — Merchants'),
    (0, common_1.Controller)('payments/merchants'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map