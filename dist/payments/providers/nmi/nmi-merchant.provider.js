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
var NmiMerchantProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NmiMerchantProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let NmiMerchantProvider = NmiMerchantProvider_1 = class NmiMerchantProvider {
    configService;
    logger = new common_1.Logger(NmiMerchantProvider_1.name);
    nmiBaseUrl;
    nmiApiKey;
    nmiPartnerKey;
    constructor(configService) {
        this.configService = configService;
        this.nmiBaseUrl = this.configService.get('NMI_BASE_URL', 'https://secure.networkmerchants.com/api');
        this.nmiApiKey = this.configService.get('NMI_API_KEY', '');
        this.nmiPartnerKey = this.configService.get('NMI_PARTNER_KEY', '');
    }
    async setupMerchant(parceraId, tenantId, dto) {
        this.logger.log(`[NMI] setupMerchant — parceraId=${parceraId}, tenantId=${tenantId}`);
        const nmiPayload = this.mapToNmiCreatePayload(dto);
        this.logger.debug('[NMI] Create payload:', nmiPayload);
        const nmiGatewayId = this.generateMockId('nmi');
        const gatewayAccountId = this.generateMockId('gwa');
        this.logger.log(`[NMI] Merchant created & activated — gatewayId=${nmiGatewayId}`);
        return {
            success: true,
            merchantId: parceraId,
            gatewayId: nmiGatewayId,
            gatewayAccountId,
            locationSpecific: false,
        };
    }
    async listMerchants(maxResults) {
        this.logger.log(`[NMI] listMerchants — maxResults=${maxResults}`);
        return {
            total: 2,
            maxResults,
            merchants: [
                { gatewayId: '1238420', company: 'Simply South Restaurant', status: 'active', createdAt: '2025-01-15T10:30:00Z' },
                { gatewayId: '1238421', company: 'Chai Point', status: 'active', createdAt: '2025-02-20T14:00:00Z' },
            ],
        };
    }
    async getMerchant(gatewayId) {
        this.logger.log(`[NMI] getMerchant — gatewayId=${gatewayId}`);
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
    async updateMerchant(gatewayId, dto) {
        this.logger.log(`[NMI] updateMerchant — gatewayId=${gatewayId}`);
        const nmiPayload = this.mapToNmiUpdatePayload(dto);
        this.logger.debug('[NMI] Update payload:', nmiPayload);
        return { success: true, gatewayId, updated: nmiPayload };
    }
    async deleteMerchant(gatewayId) {
        this.logger.log(`[NMI] deleteMerchant — gatewayId=${gatewayId}`);
        return {
            success: true,
            gatewayId,
            message: `Merchant ${gatewayId} deleted and gateway account marked as closed.`,
        };
    }
    async updateMerchantStatus(gatewayId, dto) {
        this.logger.log(`[NMI] updateMerchantStatus — gatewayId=${gatewayId}, status=${dto.status}`);
        return { id: gatewayId, status: dto.status, company: 'Simply South Restaurant' };
    }
    mapToNmiCreatePayload(dto) {
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
    mapToNmiUpdatePayload(dto) {
        const payload = {};
        if (dto.companyName)
            payload.company = dto.companyName;
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
    generateMockId(prefix) {
        return `${prefix}-${Math.floor(1_000_000 + Math.random() * 9_000_000)}`;
    }
};
exports.NmiMerchantProvider = NmiMerchantProvider;
exports.NmiMerchantProvider = NmiMerchantProvider = NmiMerchantProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NmiMerchantProvider);
//# sourceMappingURL=nmi-merchant.provider.js.map