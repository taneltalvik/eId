import { IsString, IsNotEmpty, Matches, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
	@ApiProperty({
		description: 'Gender (Female/Male)',
		example: 'F/M'
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/(^F$)|(^M$)/)
	readonly gender: string;

	@ApiProperty({
		description: 'Birth date',
		example: 'YYYY-MM-DD'
	})
	@IsDateString()
	@IsNotEmpty()
	readonly birthDate: string;
}

export default PersonDto;
