"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const merchant_provider_token_1 = require("./domain/merchant-provider.token");
const nmi_merchant_provider_1 = require("./providers/nmi/nmi-merchant.provider");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [payments_controller_1.PaymentsController],
        providers: [
            nmi_merchant_provider_1.NmiMerchantProvider,
            {
                provide: merchant_provider_token_1.MERCHANT_PROVIDER,
                useFactory: (configService, nmiProvider) => {
                    const providerName = configService.get('PAYMENT_PROVIDER', 'nmi').toLowerCase();
                    switch (providerName) {
                        case 'nmi':
                            return nmiProvider;
                        default:
                            throw new Error(`Unsupported payment provider: '${providerName}'. ` +
                                `Supported values: nmi. Set via PAYMENT_PROVIDER env var.`);
                    }
                },
                inject: [config_1.ConfigService, nmi_merchant_provider_1.NmiMerchantProvider],
            },
            payments_service_1.PaymentsService,
        ],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map