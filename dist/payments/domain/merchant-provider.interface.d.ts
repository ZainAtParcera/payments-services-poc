import { SetupMerchantDto, UpdateMerchantDto, UpdateMerchantStatusDto } from './dtos/merchant.dto';
export interface MerchantProvider {
    setupMerchant(parceraId: string, tenantId: string, dto: SetupMerchantDto): Promise<any>;
    listMerchants(maxResults: number): Promise<any>;
    getMerchant(gatewayId: string): Promise<any>;
    updateMerchant(gatewayId: string, dto: UpdateMerchantDto): Promise<any>;
    deleteMerchant(gatewayId: string): Promise<any>;
    updateMerchantStatus(gatewayId: string, dto: UpdateMerchantStatusDto): Promise<any>;
}
