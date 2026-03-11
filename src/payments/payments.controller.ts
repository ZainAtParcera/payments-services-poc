import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    ParseIntPipe,
    DefaultValuePipe,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
    SetupMerchantDto,
    UpdateMerchantDto,
    UpdateMerchantStatusDto,
} from './domain/dtos/merchant.dto';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

/**
 * PaymentsController — Provider-agnostic REST API.
 *
 * Base: /payments/merchants
 *
 * RBAC: All routes are guarded by PermissionsGuard.
 * Each handler requires the corresponding `payments_merchants.<action>` permission,
 * which must be present in request.user.permissions (populated by the auth layer).
 *
 * Permission model:
 *   Resource : payments_merchants
 *   Actions  : create | list | show | update | delete | update_status
 *
 * The resource name `nmi_merchants` is a RBAC identifier only — it does not
 * appear in any route path. Routes remain fully provider-agnostic.
 */
@ApiTags('Payments — Merchants')
@Controller('payments/merchants')
@UseGuards(PermissionsGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    // -------------------------------------------------------------------------
    // POST /payments/merchants/:parceraId/setup
    // -------------------------------------------------------------------------
    @Post(':parceraId/setup')
    @HttpCode(HttpStatus.CREATED)
    @Permissions('payments_merchants.create')
    @ApiOperation({
        summary: 'Setup Merchant',
        description:
            'Creates a merchant account with the configured payment provider, activates it, ' +
            'and returns the provider-assigned gateway ID. ' +
            'Requires permission: `payments_merchants.create`.',
    })
    @ApiParam({ name: 'parceraId', description: 'Parcera merchant UUID', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @ApiQuery({ name: 'tenantId', required: true, description: 'Tenant UUID', example: 'b1ffcd00-1c2b-4baf-9e6b-7cc8ce491b22' })
    @ApiBody({ type: SetupMerchantDto })
    @ApiResponse({
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
    })
    @ApiResponse({ status: 400, description: 'Invalid request body or missing tenantId' })
    @ApiResponse({ status: 404, description: 'Merchant or tenant not found' })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.create' })
    async setupMerchant(
        @Param('parceraId', ParseUUIDPipe) parceraId: string,
        @Query('tenantId', ParseUUIDPipe) tenantId: string,
        @Body() dto: SetupMerchantDto,
    ) {
        return this.paymentsService.setupMerchant(parceraId, tenantId, dto);
    }

    // -------------------------------------------------------------------------
    // GET /payments/merchants
    // -------------------------------------------------------------------------
    @Get()
    @Permissions('payments_merchants.list')
    @ApiOperation({
        summary: 'List Merchants',
        description:
            'Retrieve a list of merchants from the configured payment provider. ' +
            'Requires permission: `payments_merchants.list`.',
    })
    @ApiQuery({ name: 'maxResults', required: false, type: Number, example: 50, description: 'Max number of results to return' })
    @ApiResponse({
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
    })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.list' })
    async listMerchants(
        @Query('maxResults', new DefaultValuePipe(50), ParseIntPipe) maxResults: number,
    ) {
        return this.paymentsService.listMerchants(maxResults);
    }

    // -------------------------------------------------------------------------
    // GET /payments/merchants/:gatewayMerchantId
    // -------------------------------------------------------------------------
    @Get(':gatewayMerchantId')
    @Permissions('payments_merchants.show')
    @ApiOperation({
        summary: 'Get Merchant',
        description:
            'Fetch a single merchant by their provider-assigned gateway ID. ' +
            'Requires permission: `payments_merchants.show`.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiResponse({ status: 200, description: 'Merchant details returned successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.show' })
    async getMerchant(@Param('gatewayMerchantId') gatewayMerchantId: string) {
        try {
            return await this.paymentsService.getMerchant(gatewayMerchantId);
        } catch (err: any) {
            throw new NotFoundException(err.message);
        }
    }

    // -------------------------------------------------------------------------
    // PATCH /payments/merchants/:gatewayMerchantId
    // -------------------------------------------------------------------------
    @Patch(':gatewayMerchantId')
    @Permissions('payments_merchants.update')
    @ApiOperation({
        summary: 'Update Merchant',
        description:
            'Update merchant details (name, address, contact) at the configured payment provider. ' +
            'Requires permission: `payments_merchants.update`.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiBody({ type: UpdateMerchantDto })
    @ApiResponse({ status: 200, description: 'Merchant updated successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.update' })
    async updateMerchant(
        @Param('gatewayMerchantId') gatewayMerchantId: string,
        @Body() dto: UpdateMerchantDto,
    ) {
        return this.paymentsService.updateMerchant(gatewayMerchantId, dto);
    }

    // -------------------------------------------------------------------------
    // DELETE /payments/merchants/:gatewayMerchantId
    // -------------------------------------------------------------------------
    @Delete(':gatewayMerchantId')
    @HttpCode(HttpStatus.OK)
    @Permissions('payments_merchants.delete')
    @ApiOperation({
        summary: 'Delete Merchant',
        description:
            'Permanently delete a merchant account at the configured payment provider. ' +
            'Requires permission: `payments_merchants.delete`.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiResponse({ status: 200, description: 'Merchant deleted successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.delete' })
    async deleteMerchant(@Param('gatewayMerchantId') gatewayMerchantId: string) {
        return this.paymentsService.deleteMerchant(gatewayMerchantId);
    }

    // -------------------------------------------------------------------------
    // PATCH /payments/merchants/:gatewayMerchantId/status
    // -------------------------------------------------------------------------
    @Patch(':gatewayMerchantId/status')
    @Permissions('payments_merchants.update_status')
    @ApiOperation({
        summary: 'Update Merchant Status',
        description:
            'Update the operational status of a merchant (active | test | suspended | closed). ' +
            'Requires permission: `payments_merchants.update_status`.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiBody({ type: UpdateMerchantStatusDto })
    @ApiResponse({
        status: 200,
        description: 'Merchant status updated successfully',
        schema: { example: { id: '1238420', status: 'suspended', company: 'Simply South Restaurant' } },
    })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    @ApiForbiddenResponse({ description: 'Missing permission: payments_merchants.update_status' })
    async updateMerchantStatus(
        @Param('gatewayMerchantId') gatewayMerchantId: string,
        @Body() dto: UpdateMerchantStatusDto,
    ) {
        return this.paymentsService.updateMerchantStatus(gatewayMerchantId, dto);
    }
}
