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
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
    SetupMerchantDto,
    UpdateMerchantDto,
    UpdateMerchantStatusDto,
} from './domain/dtos/merchant.dto';

/**
 * PaymentsController — Provider-agnostic REST API.
 *
 * Base: /payments/merchants
 *
 * Routes contain no provider names. The active provider is selected purely
 * via the PAYMENT_PROVIDER environment variable and resolved through DI.
 * Clients are fully insulated from changes between NMI, Tilled, etc.
 */
@ApiTags('Payments — Merchants')
@Controller('payments/merchants')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    // -------------------------------------------------------------------------
    // POST /payments/merchants/:parceraId/setup
    // -------------------------------------------------------------------------
    @Post(':parceraId/setup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Setup Merchant',
        description:
            'Creates a merchant account with the configured payment provider, activates it, ' +
            'and returns the provider-assigned gateway ID. ' +
            'The active provider is determined by the PAYMENT_PROVIDER config value.',
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
    @ApiResponse({ status: 501, description: 'Configured payment provider is not implemented' })
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
    @ApiOperation({
        summary: 'List Merchants',
        description: 'Retrieve a list of merchants from the configured payment provider.',
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
    async listMerchants(
        @Query('maxResults', new DefaultValuePipe(50), ParseIntPipe) maxResults: number,
    ) {
        return this.paymentsService.listMerchants(maxResults);
    }

    // -------------------------------------------------------------------------
    // GET /payments/merchants/:gatewayMerchantId
    // -------------------------------------------------------------------------
    @Get(':gatewayMerchantId')
    @ApiOperation({
        summary: 'Get Merchant',
        description: 'Fetch a single merchant by their provider-assigned gateway ID.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiResponse({ status: 200, description: 'Merchant details returned successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
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
    @ApiOperation({
        summary: 'Update Merchant',
        description: 'Update merchant details (name, address, contact) at the configured payment provider.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiBody({ type: UpdateMerchantDto })
    @ApiResponse({ status: 200, description: 'Merchant updated successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
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
    @ApiOperation({
        summary: 'Delete Merchant',
        description: 'Permanently delete a merchant account at the configured payment provider.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiResponse({ status: 200, description: 'Merchant deleted successfully' })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    async deleteMerchant(@Param('gatewayMerchantId') gatewayMerchantId: string) {
        return this.paymentsService.deleteMerchant(gatewayMerchantId);
    }

    // -------------------------------------------------------------------------
    // PATCH /payments/merchants/:gatewayMerchantId/status
    // NOTE: must be declared after :gatewayMerchantId routes to avoid ambiguity.
    //       Express matches routes in declaration order; 'status' as a literal
    //       segment after the param is unambiguous here.
    // -------------------------------------------------------------------------
    @Patch(':gatewayMerchantId/status')
    @ApiOperation({
        summary: 'Update Merchant Status',
        description:
            'Update the operational status of a merchant (active | test | suspended | closed). ' +
            'The provider may use elevated credentials (e.g. a partner key) for this operation.',
    })
    @ApiParam({ name: 'gatewayMerchantId', description: 'Provider-assigned merchant gateway ID', example: '1238420' })
    @ApiBody({ type: UpdateMerchantStatusDto })
    @ApiResponse({
        status: 200,
        description: 'Merchant status updated successfully',
        schema: { example: { id: '1238420', status: 'suspended', company: 'Simply South Restaurant' } },
    })
    @ApiResponse({ status: 404, description: 'Merchant not found at the payment provider' })
    async updateMerchantStatus(
        @Param('gatewayMerchantId') gatewayMerchantId: string,
        @Body() dto: UpdateMerchantStatusDto,
    ) {
        return this.paymentsService.updateMerchantStatus(gatewayMerchantId, dto);
    }
}
