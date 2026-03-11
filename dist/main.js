"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Payments Service API')
        .setDescription('Abstracted payments service with pluggable payment providers.\n\n' +
        '**Active provider:** Configured via `PAYMENT_PROVIDER` env variable (currently `nmi`).\n\n' +
        'Adding a new provider (e.g. Tilled) requires only a new adapter class — ' +
        'no changes to controllers or services.')
        .setVersion('1.0')
        .addTag('Payments — Merchants', 'Generic merchant management endpoints backed by the configured payment provider')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`\n🚀 Payments Service POC is running on: http://localhost:${port}`);
    console.log(`📋 Swagger UI available at:            http://localhost:${port}/api`);
    console.log(`🔌 Active payment provider:            ${process.env.PAYMENT_PROVIDER ?? 'nmi'}\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map