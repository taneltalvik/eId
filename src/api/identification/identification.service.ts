import { Injectable } from '@nestjs/common';
import { PersonDto } from './dto/person.dto';

@Injectable()
export class IdentificationService {
	GENDER_CENTURIES = [
		{ gender: 'M', century: 18 },
		{ gender: 'F', century: 18 },
		{ gender: 'M', century: 19 },
		{ gender: 'F', century: 19 },
		{ gender: 'M', century: 20 },
		{ gender: 'F', century: 20 },
		{ gender: 'M', century: 21 },
		{ gender: 'F', century: 21 }
	];

	create(personDto: PersonDto) {
		const century = personDto.birthDate.substring(0, 2);
		const shortYear = personDto.birthDate.substring(2, 4);
		const month = personDto.birthDate.substring(5, 7);
		const day = personDto.birthDate.substring(8, 10);
		const gender = personDto.gender;

		return this.generateId(gender, century, shortYear, month, day);
	}

	validate(id: number) {
		const personalIdString = id.toString();
		const firstNum = Number(personalIdString.substring(0, 1));
		// Check first number
		if (firstNum == 9) return id + ' is not valid';

		// Check valid length
		if (personalIdString.length != 11) return id + ' is not valid';

		// Extract data from id
		const shortYear = personalIdString.substring(1, 3);
		const month = personalIdString.substring(3, 5);
		const day = personalIdString.substring(5, 7);
		const birthSequence = Number(personalIdString.substring(7, 10));
		const checkSum = Number(personalIdString.substring(10, 11));
		const genderAndCentury = this.GENDER_CENTURIES.at(firstNum - 1);
		const birthDate = genderAndCentury.century + shortYear + '-' + month + '-' + day;
		const withoutChecksum = personalIdString.substring(0, 10);

		// Check first digit, sequence, checksum and date
		if (
			firstNum >= 1 &&
			firstNum <= 8 &&
			birthSequence > 0 &&
			checkSum === this.calculateCheckSum(withoutChecksum) &&
			this.dayIsValid(new Date(birthDate), Number(day))
		)
			// Return gender, birth date and birth sequence
			return {
				gender: genderAndCentury.gender,
				birthDate: birthDate,
				birthSequence: birthSequence
			};

		// Not a valid id
		return id + ' is not valid';
	}

	dayIsValid(date: Date, day: number) {
		return date instanceof Date && !isNaN(Number(date)) && date.getDate() === day;
	}

	generateId(
		gender: string,
		century: string,
		shortYear: string,
		month: string,
		day: string
	): string {
		// Check valid date and year
		const birthDate = century + shortYear + '-' + month + '-' + day;
		if (!this.dayIsValid(new Date(birthDate), Number(day))) return 'Invalid Birth Date';
		if (Number(century + shortYear) < 1800 || Number(century + shortYear) > 2199)
			return 'Birth year out of range (1800 - 2199)';

		// Generate new id with correct checksum
		const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
		const isObject = (object) => object.gender == gender && object.century == century;
		const genderIndex = this.GENDER_CENTURIES.findIndex(isObject) + 1;
		const dayNum = random(1, 999).toString().padStart(3, '0');
		const id = genderIndex + shortYear + month + day + dayNum;
		return id + this.calculateCheckSum(id);
	}

	calculateReminder(id: string, weights: number[]): number {
		let total = 0;
		for (var i = 0; i < id.length; i++) {
			total += Number(id.charAt(i)) * weights[i];
		}
		return total % 11;
	}

	calculateCheckSum(id: string): number {
		const weights1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
		const weights2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
		let reminder = this.calculateReminder(id, weights1);
		if (reminder < 10) {
			return reminder;
		} else {
			reminder = this.calculateReminder(id, weights2);
		}
		if (reminder < 10) return reminder;
		return 0;
	}
}
