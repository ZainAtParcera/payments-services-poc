import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

/**
 * PermissionsGuard — enforces RBAC permission checks.
 *
 * Assumes a prior auth middleware/guard has authenticated the request and
 * populated `request.user` with a `permissions: string[]` field.
 *
 * Behaviour:
 *  - If no permissions are required on the route, the request is allowed through.
 *  - If permissions are required, the user must have ALL of them (AND logic).
 *  - Throws ForbiddenException if any required permission is missing.
 *
 * Example user shape expected from auth layer:
 *   { id: 'uuid', email: '...', permissions: ['payments_merchants.list', 'payments_merchants.show'] }
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions =
            this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) ?? [];

        // No permissions required — allow through
        if (!requiredPermissions.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userPermissions: string[] = user?.permissions ?? [];

        const hasAll = requiredPermissions.every((p) =>
            userPermissions.includes(p),
        );

        if (!hasAll) {
            throw new ForbiddenException(
                `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
            );
        }

        return true;
    }
}
