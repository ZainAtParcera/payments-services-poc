import { Inject, Injectable } from '@nestjs/common';
import { MERCHANT_PROVIDER } from './domain/merchant-provider.token';
import type { MerchantProvider } from './domain/merchant-provider.interface';
import {
    SetupMerchantDto,
    UpdateMerchantDto,
    UpdateMerchantStatusDto,
} from './domain/dtos/merchant.dto';

/**
 * PaymentsService — Application Service Layer.
 *
 * Depends ONLY on the MerchantProvider port (interface), not on any concrete
 * provider. This means this entire service can remain unchanged when we add a
 * new provider (Tilled, Stripe, etc.).
 *
 * The concrete provider is injected via the MERCHANT_PROVIDER token, which is
 * resolved by the factory in PaymentsModule at startup time.
 */
@Injectable()
export class PaymentsService {
    constructor(
        @Inject(MERCHANT_PROVIDER)
        private readonly merchantProvider: MerchantProvider,
    ) { }

    async setupMerchant(
        parceraId: string,
        tenantId: string,
        dto: SetupMerchantDto,
    ): Promise<any> {
        return this.merchantProvider.setupMerchant(parceraId, tenantId, dto);
    }

    async listMerchants(maxResults: number): Promise<any> {
        return this.merchantProvider.listMerchants(maxResults);
    }

    async getMerchant(gatewayId: string): Promise<any> {
        return this.merchantProvider.getMerchant(gatewayId);
    }

    async updateMerchant(gatewayId: string, dto: UpdateMerchantDto): Promise<any> {
        return this.merchantProvider.updateMerchant(gatewayId, dto);
    }

    async deleteMerchant(gatewayId: string): Promise<any> {
        return this.merchantProvider.deleteMerchant(gatewayId);
    }

    async updateMerchantStatus(
        gatewayId: string,
        dto: UpdateMerchantStatusDto,
    ): Promise<any> {
        return this.merchantProvider.updateMerchantStatus(gatewayId, dto);
    }
}
