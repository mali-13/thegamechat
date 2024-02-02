import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../src/app.module'
import { ChallengeDto } from '../../../src/challenge/challenge.dto'
import { ChallengeStatus } from '../../../src/challenge/challenge.entity'

describe('TeamChallengeController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/teams/:teamId/challenges (Post)', async () => {
    const challengeDto: ChallengeDto = {
      challengerTeamId: 1,
      challengedTeamId: 2,
      message: `Are you up for a game?`,
    }

    const { body: challenge } = await request(app.getHttpServer())
      .post(`/teams/${challengeDto.challengerTeamId}/challenges`)
      .send(challengeDto)
      .expect(201)

    expect(challenge).toEqual({
      ...challengeDto,
      status: ChallengeStatus.PENDING,
      madeOn: expect.any(String),
      challengeId: expect.any(Number),
    })
  })

  it('/teams/:teamId/challenges (GET)', async () => {
    const teamId = 1

    const { body: challenges } = await request(app.getHttpServer())
      .get(`/teams/${teamId}/challenges`)
      .expect(200)

    const expectedChallenges = [
      {
        challengerTeamId: 1,
        challengedTeamId: 2,
        message: `Are you up for a game?`,
        status: ChallengeStatus.PENDING,
        madeOn: expect.any(String),
        challengeId: expect.any(Number),
      },
    ]

    expect(challenges).toEqual(expect.arrayContaining(expectedChallenges))
  })
})
