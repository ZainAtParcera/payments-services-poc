import { SetupMerchantDto, UpdateMerchantDto, UpdateMerchantStatusDto } from './dtos/merchant.dto';

/**
 * MerchantProvider — the Port (interface) in our hexagonal architecture.
 *
 * Every payment provider (NMI, Tilled, Stripe, etc.) must implement this
 * interface. The PaymentsService depends ONLY on this abstraction — it never
 * imports a concrete provider class directly.
 *
 * Adding a new provider requires:
 *   1. Create a new class that implements this interface (a new Adapter).
 *   2. Register it in the MerchantProviderFactory.
 *   — No changes to PaymentsService or PaymentsController needed.
 */
export interface MerchantProvider {
    /**
     * Onboard a new merchant with the payment provider.
     * @param parceraId   Internal Parcera merchant UUID.
     * @param tenantId    Tenant UUID for multi-tenant setups.
     * @param dto         Provider-agnostic setup data.
     */
    setupMerchant(
        parceraId: string,
        tenantId: string,
        dto: SetupMerchantDto,
    ): Promise<any>;

    /**
     * Retrieve a paginated list of merchants from the provider.
     * @param maxResults  Maximum number of results to return.
     */
    listMerchants(maxResults: number): Promise<any>;

    /**
     * Fetch a single merchant by their provider-assigned gateway ID.
     * @param gatewayId   Provider-assigned merchant identifier.
     */
    getMerchant(gatewayId: string): Promise<any>;

    /**
     * Update merchant details (name, address, contact) at the provider.
     * @param gatewayId   Provider-assigned merchant identifier.
     * @param dto         Fields to update.
     */
    updateMerchant(gatewayId: string, dto: UpdateMerchantDto): Promise<any>;

    /**
     * Permanently delete a merchant account at the provider.
     * @param gatewayId   Provider-assigned merchant identifier.
     */
    deleteMerchant(gatewayId: string): Promise<any>;

    /**
     * Change the operational status of a merchant (active, suspended, etc.).
     * @param gatewayId   Provider-assigned merchant identifier.
     * @param dto         The new status.
     */
    updateMerchantStatus(
        gatewayId: string,
        dto: UpdateMerchantStatusDto,
    ): Promise<any>;
}
