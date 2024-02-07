import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../app.module'
import { GameChatService } from './game-chat.service'
import { Challenge, ChallengeStatus } from '../challenge/challenge.entity'
import { TeamTestData } from '../team/team.test-data'
import { TeamModule } from '../team/team.module'
import { PlayerTestData } from '../player/player.test-data'
import { PlayerModule } from '../player/player.module'
import { TeamChallengeTestData } from '../team/team-challenge/team-challenge.test-data'
import { TypeOrmModule } from '@nestjs/typeorm'

describe('GameChatService (e2e)', () => {
  let app: INestApplication
  let gameChatService: GameChatService

  let teamTestData: TeamTestData
  let playerTestData: PlayerTestData
  let teamChallengeTestData: TeamChallengeTestData

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TeamModule,
        PlayerModule,
        TypeOrmModule.forFeature([Challenge]),
      ],
      providers: [TeamTestData, PlayerTestData, TeamChallengeTestData],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    gameChatService = app.get<GameChatService>(GameChatService)

    teamTestData = app.get<TeamTestData>(TeamTestData)
    playerTestData = app.get<PlayerTestData>(PlayerTestData)
    teamChallengeTestData = app.get<TeamChallengeTestData>(
      TeamChallengeTestData,
    )
  })

  it('create', async () => {
    const arnold = await playerTestData.createPlayer({ name: 'Arnold' })
    const gerald = await playerTestData.createPlayer({ name: 'Gerald' })

    const teamAarnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
    })
    const teamGerald = await teamTestData.createTeam({
      name: 'Team Gerald',
      creatorId: gerald.playerId,
    })

    const challenge = await teamChallengeTestData.createChallenge({
      challengerTeamId: teamAarnold.teamId,
      challengedTeamId: teamGerald.teamId,
      status: ChallengeStatus.ACCEPTED,
    })

    const gameChat = await gameChatService.create(challenge)

    expect(gameChat.challengerTeamId).toBe(teamAarnold.teamId)
    expect(gameChat.challengedTeamId).toBe(teamGerald.teamId)
    expect(gameChat.channelId).toEqual(expect.any(String))
  })
})
