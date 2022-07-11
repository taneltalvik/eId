import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Personal identification number API')
		.setDescription('This is Estonian personal ID generator and verifier')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	const customOptions: SwaggerCustomOptions = {
		customSiteTitle: 'Personal identification number API Docs'
	};
	SwaggerModule.setup('api', app, document, customOptions);

	await app.listen(3000);
}
bootstrap();
