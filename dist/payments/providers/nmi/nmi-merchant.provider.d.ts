import { ConfigService } from '@nestjs/config';
import { MerchantProvider } from '../../domain/merchant-provider.interface';
import { SetupMerchantDto, UpdateMerchantDto, UpdateMerchantStatusDto } from '../../domain/dtos/merchant.dto';
export declare class NmiMerchantProvider implements MerchantProvider {
    private readonly configService;
    private readonly logger;
    private readonly nmiBaseUrl;
    private readonly nmiApiKey;
    private readonly nmiPartnerKey;
    constructor(configService: ConfigService);
    setupMerchant(parceraId: string, tenantId: string, dto: SetupMerchantDto): Promise<any>;
    listMerchants(maxResults: number): Promise<any>;
    getMerchant(gatewayId: string): Promise<any>;
    updateMerchant(gatewayId: string, dto: UpdateMerchantDto): Promise<any>;
    deleteMerchant(gatewayId: string): Promise<any>;
    updateMerchantStatus(gatewayId: string, dto: UpdateMerchantStatusDto): Promise<any>;
    private mapToNmiCreatePayload;
    private mapToNmiUpdatePayload;
    private generateMockId;
}
