import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEmail,
    MinLength,
    MaxLength,
    IsIn,
} from 'class-validator';

// ---------------------------------------------------------------------------
// Provider-agnostic DTOs
// These DTOs represent our internal domain model and are intentionally
// decoupled from any specific payment provider (NMI, Tilled, etc.).
// ---------------------------------------------------------------------------

export class AddressDto {
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

    @ApiProperty({ example: 'US', required: false, default: 'US' })
    @IsOptional()
    @IsString()
    country?: string;
}

export class ContactDto {
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

export class SetupMerchantDto {
    @ApiProperty({ example: 'Simply South Restaurant' })
    @IsString()
    companyName: string;

    @ApiProperty({ type: AddressDto })
    address: AddressDto;

    @ApiProperty({ type: ContactDto })
    contact: ContactDto;

    @ApiProperty({ example: 'restaurant', required: false })
    @IsOptional()
    @IsString()
    industryType?: string;
}

export class UpdateMerchantDto {
    @ApiProperty({ example: 'Simply South Bistro', required: false })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ type: AddressDto, required: false })
    @IsOptional()
    address?: AddressDto;

    @ApiProperty({ type: ContactDto, required: false })
    @IsOptional()
    contact?: ContactDto;
}

export class UpdateMerchantStatusDto {
    @ApiProperty({
        example: 'active',
        enum: ['active', 'test', 'suspended', 'closed'],
        description: 'New status for the merchant account',
    })
    @IsIn(['active', 'test', 'suspended', 'closed'])
    status: 'active' | 'test' | 'suspended' | 'closed';
}
