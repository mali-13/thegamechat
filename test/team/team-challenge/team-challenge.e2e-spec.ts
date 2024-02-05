import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../src/app.module'
import {
  ChallengeDto,
  UpdateChallengeDto,
} from '../../../src/challenge/challenge.dto'
import {
  Challenge,
  ChallengeStatus,
} from '../../../src/challenge/challenge.entity'
import { GameChatService } from '../../../src/game-chat/game-chat.service'
import { createChallenge } from './team-challenge.test-data'

describe('TeamChallengeController (e2e)', () => {
  let app: INestApplication
  let gameChatService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    gameChatService = app.get<GameChatService>(GameChatService)

    jest.spyOn(gameChatService, 'create').mockResolvedValue(null)
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

  it('/teams/:teamId/challenges (PUT)', async () => {
    await createChallenge(
      {
        challengeId: 4,
        challengerTeamId: 1,
        challengedTeamId: 2,
        status: ChallengeStatus.PENDING,
      },
      app,
    )

    const challengeDto: UpdateChallengeDto = {
      challengeId: 4,
      status: ChallengeStatus.ACCEPTED,
      challengerTeamId: 1,
    }

    const { body: challenge } = await request(app.getHttpServer())
      .patch(
        `/teams/${challengeDto.challengerTeamId}/challenges/${challengeDto.challengeId}`,
      )
      .send(challengeDto)
      .expect(200)

    expect(challenge.status).toEqual(ChallengeStatus.ACCEPTED)
  })

  describe('/teams/:teamId/challenges (GET)', () => {
    beforeAll(async () => {
      await createChallenge(
        {
          challengeId: 1,
          challengerTeamId: 1,
          challengedTeamId: 2,
          message: `Are you up for a game?`,
          status: ChallengeStatus.PENDING,
        },
        app,
      )

      await createChallenge(
        {
          challengeId: 2,
          challengerTeamId: 1,
          challengedTeamId: 2,
          message: `Are you up for a game?`,
          status: ChallengeStatus.REJECTED,
        },
        app,
      )

      await createChallenge(
        {
          challengeId: 3,
          challengerTeamId: 2,
          challengedTeamId: 1,
          message: `Are you up for a game?`,
          status: ChallengeStatus.PENDING,
        },
        app,
      )
    })

    it('/teams/:teamId/challenges?challenger=true (GET)', async () => {
      const teamId = 1

      const { body: challenges } = await request(app.getHttpServer())
        .get(`/teams/${teamId}/challenges`)
        .query({ challenger: true })
        .expect(200)

      const anyChallenger = challenges.some(
        (challenge: Challenge) => challenge.challengerTeamId === teamId,
      )

      const anyChallenged = challenges.some(
        (challenge: Challenge) => challenge.challengedTeamId === teamId,
      )

      expect(anyChallenger).toBe(true)
      expect(anyChallenged).toBe(false)
    })

    it('/teams/:teamId/challenges?challenged=true (GET)', async () => {
      const teamId = 1

      const { body: challenges } = await request(app.getHttpServer())
        .get(`/teams/${teamId}/challenges`)
        .query({ challenged: true })
        .expect(200)

      const anyChallenger = challenges.some(
        (challenge: Challenge) => challenge.challengerTeamId === teamId,
      )

      const anyChallenged = challenges.some(
        (challenge: Challenge) => challenge.challengedTeamId === teamId,
      )

      expect(anyChallenger).toBe(false)
      expect(anyChallenged).toBe(true)
    })

    it('/teams/:teamId/challenges?status=pending (GET)', async () => {
      const teamId = 1

      const { body: challenges } = await request(app.getHttpServer())
        .get(`/teams/${teamId}/challenges`)
        .query({ status: 'pending' })
        .expect(200)

      const anyWithPendingStatus = challenges.some(
        (challenge) => challenge.status === ChallengeStatus.PENDING,
      )

      const anyWithWrongStatus = challenges.some(
        (challenge) => challenge.status !== ChallengeStatus.PENDING,
      )

      expect(anyWithPendingStatus).toBe(true)
      expect(anyWithWrongStatus).toBe(false)
    })
  })
})
