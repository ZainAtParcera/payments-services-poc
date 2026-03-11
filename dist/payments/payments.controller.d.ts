import { PaymentsService } from './payments.service';
import { SetupMerchantDto, UpdateMerchantDto, UpdateMerchantStatusDto } from './domain/dtos/merchant.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    setupMerchant(parceraId: string, tenantId: string, dto: SetupMerchantDto): Promise<any>;
    listMerchants(maxResults: number): Promise<any>;
    getMerchant(gatewayMerchantId: string): Promise<any>;
    updateMerchant(gatewayMerchantId: string, dto: UpdateMerchantDto): Promise<any>;
    deleteMerchant(gatewayMerchantId: string): Promise<any>;
    updateMerchantStatus(gatewayMerchantId: string, dto: UpdateMerchantStatusDto): Promise<any>;
}
