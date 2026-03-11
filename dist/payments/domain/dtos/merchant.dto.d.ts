export declare class AddressDto {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}
export declare class ContactDto {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
export declare class SetupMerchantDto {
    companyName: string;
    address: AddressDto;
    contact: ContactDto;
    industryType?: string;
}
export declare class UpdateMerchantDto {
    companyName?: string;
    address?: AddressDto;
    contact?: ContactDto;
}
export declare class UpdateMerchantStatusDto {
    status: 'active' | 'test' | 'suspended' | 'closed';
}
