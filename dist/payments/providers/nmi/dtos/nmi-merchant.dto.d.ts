export declare class NmiAddressDto {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}
export declare class NmiContactDto {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
export declare class SetupNmiDto {
    companyName: string;
    address: NmiAddressDto;
    contact: NmiContactDto;
    industryType?: string;
    locationSpecific?: boolean;
}
export declare class UpdateNmiMerchantDto {
    companyName?: string;
    address?: NmiAddressDto;
    contact?: NmiContactDto;
}
export declare class UpdateNmiStatusDto {
    status: 'active' | 'test' | 'suspended' | 'closed';
}
