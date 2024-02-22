import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../app.module'
import { PlayerModule } from '../player.module'
import * as request from 'supertest'
import { CreatePlayerDto } from '../player.dto'

describe('Player Creator (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PlayerModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('player creator controller creates a player and a mattermost user', async () => {
    const createPlayerDto: CreatePlayerDto = {
      name: 'Buhar',
      location: 'Pristina',
      age: 26,
      password: '123123',
    }

    const { body: player } = await request(app.getHttpServer())
      .post('/players')
      .send(createPlayerDto)
      .expect(201)

    expect(player).toEqual({
      name: 'Buhar',
      location: 'Pristina',
      age: 26,
      mattermostUserId: expect.any(String),
      playerId: expect.any(Number),
    })
  })
})
