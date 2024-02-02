import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'
import { ChallengeDto } from '../../src/challenge/challenge.dto'
import { ChallengeStatus } from '../../src/challenge/challenge.entity'

describe('ChallengeController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (Post)', async () => {
    const challengeDto: ChallengeDto = {
      challengerTeamId: 1,
      challengedTeamId: 2,
      message: `Are you up for a game?`,
    }

    const { body: challenge } = await request(app.getHttpServer())
      .post('/challenges')
      .send(challengeDto)
      .expect(201)

    expect(challenge).toEqual({
      ...challengeDto,
      status: ChallengeStatus.PENDING,
      madeOn: expect.any(String),
      challengeId: expect.any(Number),
    })
  })
})
