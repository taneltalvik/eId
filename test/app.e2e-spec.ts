import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import PersonDto from 'src/api/identification/dto/person.dto';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		pactum.request.setBaseUrl('http://localhost:3000');
	});

	describe('Person', () => {
		describe('Not create person id', () => {
			const wrongGenderInputDto: PersonDto = {
				gender: 'U',
				birthDate: '1990-04-21'
			};
			it('should not create person id due wrong gender input', () => {
				return pactum
					.spec()
					.post('/api/person/')
					.withBody(wrongGenderInputDto)
					.expectStatus(400)
					.expectBodyContains('gender must match /(^F$)|(^M$)/ regular expression');
			});

			const wrongDateFormatDto: PersonDto = {
				gender: 'M',
				birthDate: '28.01.1990'
			};

			it('should not create person id due wrong birth date format', () => {
				return pactum
					.spec()
					.post('/api/person/')
					.withBody(wrongDateFormatDto)
					.expectStatus(400)
					.expectBodyContains('birthDate must be a valid ISO 8601 date string');
			});

			const wrongDateDto: PersonDto = {
				gender: 'M',
				birthDate: '1990-02-31'
			};

			it('should not create person id due wrong birth date', () => {
				return pactum
					.spec()
					.post('/api/person/')
					.withBody(wrongDateFormatDto)
					.expectStatus(400)
					.expectBodyContains('birthDate must be a valid ISO 8601 date string');
			});
		});
		describe('Create person id', () => {
			const femaleDto: PersonDto = {
				gender: 'F',
				birthDate: '1990-04-21'
			};
			it('should create female person id', () => {
				return pactum
					.spec()
					.post('/api/person/')
					.withBody(femaleDto)
					.expectStatus(201)
					.stores('femalePersonId', 'res.body');
			});

			const maleDto: PersonDto = {
				gender: 'M',
				birthDate: '1980-02-28'
			};

			it('should create male person id', () => {
				return pactum
					.spec()
					.post('/api/person/')
					.withBody(maleDto)
					.expectStatus(201)
					.stores('malePersonId', 'res.body');
			});
		});

		describe('Valid person id', () => {
			it('should validate female person id as valid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '$S{femalePersonId}')
					.expectStatus(200);
			});
			it('should validate male person id as valid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '$S{malePersonId}')
					.expectStatus(200);
			});
		});

		describe('Invalid person id', () => {
			it('should validate id length less than 11 as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '123456789')
					.expectStatus(200)
					.expectBody('123456789 is not valid');
			});

			it('should validate id length more than 11 as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '123456789012')
					.expectStatus(200)
					.expectBody('123456789012 is not valid');
			});

			it('should validate 0 in first position as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '08804046055')
					.expectStatus(200)
					.expectBody('8804046055 is not valid');
			});

			it('should validate 9 in first position as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '98804046055')
					.expectStatus(200)
					.expectBody('98804046055 is not valid');
			});

			it('should validate wrong date as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '38802315008')
					.expectStatus(200)
					.expectBody('38802315008 is not valid');
			});

			it('should validate wrong sequence as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '48802200000')
					.expectStatus(200)
					.expectBody('48802200000 is not valid');
			});

			it('should validate wrong checksum as invalid', () => {
				return pactum
					.spec()
					.get('/api/person/{id}')
					.withPathParams('id', '48802200010')
					.expectStatus(200)
					.expectBody('48802200010 is not valid');
			});
		});
	});
});
