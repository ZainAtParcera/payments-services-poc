import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEmail,
    IsIn,
    MinLength,
    MaxLength,
    IsBoolean,
} from 'class-validator';

/**
 * NMI-specific DTOs — these live in the NMI adapter layer, not in the domain.
 * They capture extra NMI-specific fields on top of the generic domain model.
 */

export class NmiAddressDto {
    @ApiProperty({ example: '123 Main Street' })
    @IsString()
    address1: string;

    @ApiProperty({ example: 'Suite 100', required: false })
    @IsOptional()
    @IsString()
    address2?: string;

    @ApiProperty({ example: 'Dallas' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'TX' })
    @IsString()
    state: string;

    @ApiProperty({ example: '75201' })
    @IsString()
    @MinLength(5)
    @MaxLength(10)
    zip: string;

    @ApiProperty({ example: 'US', default: 'US' })
    @IsOptional()
    @IsString()
    country?: string;
}

export class NmiContactDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: '+14695551234' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
}

/**
 * SetupNmiDto — body for POST /:parceraId/nmi-setup
 * Includes NMI-specific fields like locationSpecific, industryType, etc.
 */
export class SetupNmiDto {
    @ApiProperty({ example: 'Simply South Restaurant' })
    @IsString()
    companyName: string;

    @ApiProperty({ type: NmiAddressDto })
    address: NmiAddressDto;

    @ApiProperty({ type: NmiContactDto })
    contact: NmiContactDto;

    @ApiProperty({
        example: 'restaurant',
        required: false,
        description: 'NMI industry type classification',
    })
    @IsOptional()
    @IsString()
    industryType?: string;

    @ApiProperty({
        example: false,
        required: false,
        description: 'Whether this merchant account is location-specific',
    })
    @IsOptional()
    @IsBoolean()
    locationSpecific?: boolean;
}

/**
 * UpdateNmiMerchantDto — body for PATCH /nmi/:nmiGatewayId
 */
export class UpdateNmiMerchantDto {
    @ApiProperty({ example: 'Simply South Bistro', required: false })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ type: NmiAddressDto, required: false })
    @IsOptional()
    address?: NmiAddressDto;

    @ApiProperty({ type: NmiContactDto, required: false })
    @IsOptional()
    contact?: NmiContactDto;
}

/**
 * UpdateNmiStatusDto — body for PATCH /nmi/:nmiGatewayId/status
 */
export class UpdateNmiStatusDto {
    @ApiProperty({
        example: 'active',
        enum: ['active', 'test', 'suspended', 'closed'],
        description: 'New status for the NMI merchant account',
    })
    @IsIn(['active', 'test', 'suspended', 'closed'])
    status: 'active' | 'test' | 'suspended' | 'closed';
}
