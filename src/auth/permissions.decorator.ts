import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * @Permissions decorator — attaches required permission strings to a route handler.
 *
 * Usage:
 *   @Permissions('payments_merchants.create')
 *
 * Convention: '<resource>.<action>'
 * The PermissionsGuard reads these at runtime and checks against request.user.permissions.
 */
export const Permissions = (...permissions: string[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);
