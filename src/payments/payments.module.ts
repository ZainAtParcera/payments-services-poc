import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

// Domain
import { MERCHANT_PROVIDER } from './domain/merchant-provider.token';

// Provider implementations
import { NmiMerchantProvider } from './providers/nmi/nmi-merchant.provider';

/**
 * PaymentsModule — wires everything together.
 *
 * The custom useFactory provider reads PAYMENT_PROVIDER from config and
 * instantiates the correct adapter. PaymentsService receives only the
 * MerchantProvider abstraction (via MERCHANT_PROVIDER token) — it never
 * references a concrete provider class.
 *
 * To add a new provider (e.g. Tilled):
 *   1. Create TilledMerchantProvider implementing MerchantProvider.
 *   2. Add it to the providers array below.
 *   3. Add 'tilled' case in the factory switch.
 *   4. Set PAYMENT_PROVIDER=tilled in .env.
 *   — Zero changes to PaymentsService or PaymentsController.
 */
@Module({
    imports: [ConfigModule],
    controllers: [PaymentsController],
    providers: [
        // Concrete adapters (register new ones here as they are built)
        NmiMerchantProvider,

        // The DI-resolved MerchantProvider — built from config at startup
        {
            provide: MERCHANT_PROVIDER,
            useFactory: (configService: ConfigService, nmiProvider: NmiMerchantProvider) => {
                const providerName = configService.get<string>('PAYMENT_PROVIDER', 'nmi').toLowerCase();
                switch (providerName) {
                    case 'nmi':
                        return nmiProvider;

                    // Future providers:
                    // case 'tilled':
                    //   return tilledProvider;

                    default:
                        throw new Error(
                            `Unsupported payment provider: '${providerName}'. ` +
                            `Supported values: nmi. Set via PAYMENT_PROVIDER env var.`,
                        );
                }
            },
            inject: [ConfigService, NmiMerchantProvider],
        },

        PaymentsService,
    ],
    exports: [PaymentsService],
})
export class PaymentsModule { }
