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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const merchant_provider_token_1 = require("./domain/merchant-provider.token");
let PaymentsService = class PaymentsService {
    merchantProvider;
    constructor(merchantProvider) {
        this.merchantProvider = merchantProvider;
    }
    async setupMerchant(parceraId, tenantId, dto) {
        return this.merchantProvider.setupMerchant(parceraId, tenantId, dto);
    }
    async listMerchants(maxResults) {
        return this.merchantProvider.listMerchants(maxResults);
    }
    async getMerchant(gatewayId) {
        return this.merchantProvider.getMerchant(gatewayId);
    }
    async updateMerchant(gatewayId, dto) {
        return this.merchantProvider.updateMerchant(gatewayId, dto);
    }
    async deleteMerchant(gatewayId) {
        return this.merchantProvider.deleteMerchant(gatewayId);
    }
    async updateMerchantStatus(gatewayId, dto) {
        return this.merchantProvider.updateMerchantStatus(gatewayId, dto);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(merchant_provider_token_1.MERCHANT_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map