import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { PersonDto } from './dto/person.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/person')
@ApiTags('person')
export class IdentificationController {
	constructor(private readonly identificationService: IdentificationService) {}

	@Post()
	create(@Body() personDto: PersonDto) {
		return this.identificationService.create(personDto);
	}

	@Get(':id')
	validate(@Param('id', ParseIntPipe) id: number) {
		return this.identificationService.validate(id);
	}
}
