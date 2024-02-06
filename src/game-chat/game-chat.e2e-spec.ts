import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../app.module'
import { GameChatService } from './game-chat.service'
import { createPlayer } from '../player/player.test-data'
import { createTeam } from '../team/team.test-data'
import { createChallenge } from '../team/team-challenge/team-challenge.test-data'
import { ChallengeStatus } from '../challenge/challenge.entity'

describe('GameChatService (e2e)', () => {
  let app: INestApplication
  let gameChatService: GameChatService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    gameChatService = app.get<GameChatService>(GameChatService)
  })

  it('create', async () => {
    const arnold = await createPlayer({ name: 'Arnold' }, app)
    const gerald = await createPlayer({ name: 'Gerald' }, app)

    const teamAarnold = await createTeam(
      { name: 'Team Arnold', creatorId: arnold.playerId },
      app,
    )
    const teamGerald = await createTeam(
      { name: 'Team Gerald', creatorId: gerald.playerId },
      app,
    )

    const challenge = await createChallenge(
      {
        challengerTeamId: teamAarnold.teamId,
        challengedTeamId: teamGerald.teamId,
        status: ChallengeStatus.ACCEPTED,
      },
      app,
    )

    const gameChat = await gameChatService.create(challenge)

    expect(gameChat.challengerTeamId).toBe(teamAarnold.teamId)
    expect(gameChat.challengedTeamId).toBe(teamGerald.teamId)
    expect(gameChat.channelId).toEqual(expect.any(String))
  })
})
