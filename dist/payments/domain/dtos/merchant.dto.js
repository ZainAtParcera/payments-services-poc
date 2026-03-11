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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMerchantStatusDto = exports.UpdateMerchantDto = exports.SetupMerchantDto = exports.ContactDto = exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddressDto {
    address1;
    address2;
    city;
    state;
    zip;
    country;
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "address1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Suite 100', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "address2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dallas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TX' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '75201' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], AddressDto.prototype, "zip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'US', required: false, default: 'US' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
class ContactDto {
    firstName;
    lastName;
    phone;
    email;
}
exports.ContactDto = ContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+14695551234' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ContactDto.prototype, "email", void 0);
class SetupMerchantDto {
    companyName;
    address;
    contact;
    industryType;
}
exports.SetupMerchantDto = SetupMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Simply South Restaurant' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetupMerchantDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AddressDto }),
    __metadata("design:type", AddressDto)
], SetupMerchantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ContactDto }),
    __metadata("design:type", ContactDto)
], SetupMerchantDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'restaurant', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetupMerchantDto.prototype, "industryType", void 0);
class UpdateMerchantDto {
    companyName;
    address;
    contact;
}
exports.UpdateMerchantDto = UpdateMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Simply South Bistro', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AddressDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", AddressDto)
], UpdateMerchantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ContactDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ContactDto)
], UpdateMerchantDto.prototype, "contact", void 0);
class UpdateMerchantStatusDto {
    status;
}
exports.UpdateMerchantStatusDto = UpdateMerchantStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'active',
        enum: ['active', 'test', 'suspended', 'closed'],
        description: 'New status for the merchant account',
    }),
    (0, class_validator_1.IsIn)(['active', 'test', 'suspended', 'closed']),
    __metadata("design:type", String)
], UpdateMerchantStatusDto.prototype, "status", void 0);
//# sourceMappingURL=merchant.dto.js.map