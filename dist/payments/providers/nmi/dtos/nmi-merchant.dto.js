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
exports.UpdateNmiStatusDto = exports.UpdateNmiMerchantDto = exports.SetupNmiDto = exports.NmiContactDto = exports.NmiAddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class NmiAddressDto {
    address1;
    address2;
    city;
    state;
    zip;
    country;
}
exports.NmiAddressDto = NmiAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "address1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Suite 100', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "address2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dallas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TX' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '75201' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "zip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'US', default: 'US' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiAddressDto.prototype, "country", void 0);
class NmiContactDto {
    firstName;
    lastName;
    phone;
    email;
}
exports.NmiContactDto = NmiContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiContactDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiContactDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+14695551234' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NmiContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], NmiContactDto.prototype, "email", void 0);
class SetupNmiDto {
    companyName;
    address;
    contact;
    industryType;
    locationSpecific;
}
exports.SetupNmiDto = SetupNmiDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Simply South Restaurant' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetupNmiDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NmiAddressDto }),
    __metadata("design:type", NmiAddressDto)
], SetupNmiDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NmiContactDto }),
    __metadata("design:type", NmiContactDto)
], SetupNmiDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'restaurant',
        required: false,
        description: 'NMI industry type classification',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetupNmiDto.prototype, "industryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        required: false,
        description: 'Whether this merchant account is location-specific',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SetupNmiDto.prototype, "locationSpecific", void 0);
class UpdateNmiMerchantDto {
    companyName;
    address;
    contact;
}
exports.UpdateNmiMerchantDto = UpdateNmiMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Simply South Bistro', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNmiMerchantDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NmiAddressDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", NmiAddressDto)
], UpdateNmiMerchantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NmiContactDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", NmiContactDto)
], UpdateNmiMerchantDto.prototype, "contact", void 0);
class UpdateNmiStatusDto {
    status;
}
exports.UpdateNmiStatusDto = UpdateNmiStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'active',
        enum: ['active', 'test', 'suspended', 'closed'],
        description: 'New status for the NMI merchant account',
    }),
    (0, class_validator_1.IsIn)(['active', 'test', 'suspended', 'closed']),
    __metadata("design:type", String)
], UpdateNmiStatusDto.prototype, "status", void 0);
//# sourceMappingURL=nmi-merchant.dto.js.map