import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MerchantProvider } from '../../domain/merchant-provider.interface';
import {
    SetupMerchantDto,
    UpdateMerchantDto,
    UpdateMerchantStatusDto,
} from '../../domain/dtos/merchant.dto';

/**
 * NmiMerchantProvider — the NMI Adapter.
 *
 * This is the ONLY file in the codebase that knows about NMI:
 *   - NMI API base URL and credentials (read from config)
 *   - Payload mapping from generic domain DTOs → NMI-specific request shapes
 *   - NMI-specific field names (company, first_name, industry_type, etc.)
 *   - NMI-specific error handling and response parsing
 *
 * The controller and PaymentsService are completely unaware of this class.
 * They only see the MerchantProvider interface, injected via MERCHANT_PROVIDER token.
 *
 * NOTE: Outbound HTTP calls are currently mocked/simulated. Replace the
 * comments marked "In production" with real Axios calls once credentials are available.
 */
@Injectable()
export class NmiMerchantProvider implements MerchantProvider {
    private readonly logger = new Logger(NmiMerchantProvider.name);
    private readonly nmiBaseUrl: string;
    private readonly nmiApiKey: string;
    private readonly nmiPartnerKey: string;

    constructor(private readonly configService: ConfigService) {
        this.nmiBaseUrl = this.configService.get<string>('NMI_BASE_URL', 'https://secure.networkmerchants.com/api');
        this.nmiApiKey = this.configService.get<string>('NMI_API_KEY', '');
        this.nmiPartnerKey = this.configService.get<string>('NMI_PARTNER_KEY', '');
    }

    // ---------------------------------------------------------------------------
    // Setup / Onboarding
    // ---------------------------------------------------------------------------

    async setupMerchant(parceraId: string, tenantId: string, dto: SetupMerchantDto): Promise<any> {
        this.logger.log(`[NMI] setupMerchant — parceraId=${parceraId}, tenantId=${tenantId}`);

        // Map generic DTO → NMI-specific payload
        const nmiPayload = this.mapToNmiCreatePayload(dto);
        this.logger.debug('[NMI] Create payload:', nmiPayload);

        // In production:
        //   const response = await axios.post(`${this.nmiBaseUrl}/v1/merchants`, nmiPayload, {
        //     headers: { Authorization: `Bearer ${this.nmiApiKey}` },
        //   });
        const nmiGatewayId = this.generateMockId('nmi');
        const gatewayAccountId = this.generateMockId('gwa');

        // In production, also call the activation endpoint:
        //   await axios.post(`${this.nmiBaseUrl}/v1/merchants/${nmiGatewayId}/activate`, {});
        this.logger.log(`[NMI] Merchant created & activated — gatewayId=${nmiGatewayId}`);

        return {
            success: true,
            merchantId: parceraId,
            gatewayId: nmiGatewayId,
            gatewayAccountId,
            locationSpecific: false,
        };
    }

    // ---------------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------------

    async listMerchants(maxResults: number): Promise<any> {
        this.logger.log(`[NMI] listMerchants — maxResults=${maxResults}`);

        // In production:
        //   const response = await axios.get(`${this.nmiBaseUrl}/v1/merchants`, {
        //     params: { limit: maxResults },
        //     headers: { Authorization: `Bearer ${this.nmiPartnerKey}` },
        //   });

        return {
            total: 2,
            maxResults,
            merchants: [
                { gatewayId: '1238420', company: 'Simply South Restaurant', status: 'active', createdAt: '2025-01-15T10:30:00Z' },
                { gatewayId: '1238421', company: 'Chai Point', status: 'active', createdAt: '2025-02-20T14:00:00Z' },
            ],
        };
    }

    // ---------------------------------------------------------------------------
    // Get
    // ---------------------------------------------------------------------------

    async getMerchant(gatewayId: string): Promise<any> {
        this.logger.log(`[NMI] getMerchant — gatewayId=${gatewayId}`);

        // In production:
        //   const response = await axios.get(`${this.nmiBaseUrl}/v1/merchants/${gatewayId}`, {
        //     headers: { Authorization: `Bearer ${this.nmiApiKey}` },
        //   });

        if (gatewayId === '0000000') {
            throw new Error(`Merchant not found: ${gatewayId}`);
        }

        return {
            gatewayId,
            company: 'Simply South Restaurant',
            status: 'active',
            address: { address1: '123 Main St', city: 'Dallas', state: 'TX', zip: '75201', country: 'US' },
            contact: { firstName: 'John', lastName: 'Doe', phone: '+14695551234', email: 'john@example.com' },
        };
    }

    // ---------------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------------

    async updateMerchant(gatewayId: string, dto: UpdateMerchantDto): Promise<any> {
        this.logger.log(`[NMI] updateMerchant — gatewayId=${gatewayId}`);

        const nmiPayload = this.mapToNmiUpdatePayload(dto);
        this.logger.debug('[NMI] Update payload:', nmiPayload);

        // In production:
        //   await axios.patch(`${this.nmiBaseUrl}/v1/merchants/${gatewayId}`, nmiPayload, {
        //     headers: { Authorization: `Bearer ${this.nmiApiKey}` },
        //   });

        return { success: true, gatewayId, updated: nmiPayload };
    }

    // ---------------------------------------------------------------------------
    // Delete
    // ---------------------------------------------------------------------------

    async deleteMerchant(gatewayId: string): Promise<any> {
        this.logger.log(`[NMI] deleteMerchant — gatewayId=${gatewayId}`);

        // In production:
        //   await axios.delete(`${this.nmiBaseUrl}/v1/merchants/${gatewayId}`, {
        //     headers: { Authorization: `Bearer ${this.nmiApiKey}` },
        //   });

        return {
            success: true,
            gatewayId,
            message: `Merchant ${gatewayId} deleted and gateway account marked as closed.`,
        };
    }

    // ---------------------------------------------------------------------------
    // Update Status (uses NMI_PARTNER_KEY)
    // ---------------------------------------------------------------------------

    async updateMerchantStatus(gatewayId: string, dto: UpdateMerchantStatusDto): Promise<any> {
        this.logger.log(`[NMI] updateMerchantStatus — gatewayId=${gatewayId}, status=${dto.status}`);

        // NMI requires the partner key (not the standard API key) for status changes
        // In production:
        //   await axios.put(`${this.nmiBaseUrl}/v1/merchants/${gatewayId}/status`, { status: dto.status }, {
        //     headers: { Authorization: `Bearer ${this.nmiPartnerKey}` },
        //   });

        return { id: gatewayId, status: dto.status, company: 'Simply South Restaurant' };
    }

    // ---------------------------------------------------------------------------
    // Private NMI payload mappers
    // These are the only NMI-specific mappings in the codebase — camelCase → snake_case,
    // domain field names → NMI field names, etc.
    // ---------------------------------------------------------------------------

    private mapToNmiCreatePayload(dto: SetupMerchantDto): Record<string, unknown> {
        return {
            company: dto.companyName,
            address: {
                address1: dto.address?.address1,
                address2: dto.address?.address2,
                city: dto.address?.city,
                state: dto.address?.state,
                zip: dto.address?.zip,
                country: dto.address?.country ?? 'US',
            },
            contact: {
                first_name: dto.contact?.firstName,
                last_name: dto.contact?.lastName,
                phone: dto.contact?.phone,
                email: dto.contact?.email,
            },
            industry_type: dto.industryType ?? 'other',
        };
    }

    private mapToNmiUpdatePayload(dto: UpdateMerchantDto): Record<string, unknown> {
        const payload: Record<string, unknown> = {};
        if (dto.companyName) payload.company = dto.companyName;
        if (dto.address) {
            payload.address = {
                address1: dto.address.address1,
                address2: dto.address.address2,
                city: dto.address.city,
                state: dto.address.state,
                zip: dto.address.zip,
                country: dto.address.country ?? 'US',
            };
        }
        if (dto.contact) {
            payload.contact = {
                first_name: dto.contact.firstName,
                last_name: dto.contact.lastName,
                phone: dto.contact.phone,
                email: dto.contact.email,
            };
        }
        return payload;
    }

    private generateMockId(prefix: string): string {
        return `${prefix}-${Math.floor(1_000_000 + Math.random() * 9_000_000)}`;
    }
}
