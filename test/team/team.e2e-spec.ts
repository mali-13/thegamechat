import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

describe('TeamController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', async () => {
    const { body: teams } = await request(app.getHttpServer())
      .get('/teams')
      .expect(200)

    expect(teams).toHaveLength(2)
  })

  it('/ (GET1)', async () => {
    const { body: teams } = await request(app.getHttpServer())
      .get('/teams')
      .expect(200)

    expect(teams).toHaveLength(2)
  })
})
