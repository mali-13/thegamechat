import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../app.module'
import { Challenge, ChallengeStatus } from '../challenge/challenge.entity'
import { TeamTestData } from '../team/team.test-data'
import { TeamModule } from '../team/team.module'
import { PlayerTestData } from '../player/player.test-data'
import { PlayerModule } from '../player/player.module'
import { TeamChallengeTestData } from '../team/team-challenge/team-challenge.test-data'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameChatService } from '../game-chat/game-chat.service'
import { TeamChannelSync } from './team-channel-sync'
import { TeamPlayerService } from '../team/team-player/team-player.service'

describe('TeamChannelSync (e2e)', () => {
  let app: INestApplication
  let gameChatService: GameChatService
  let teamPlayerService: TeamPlayerService
  let teamChannelSync: TeamChannelSync

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
    teamChannelSync = app.get<TeamChannelSync>(TeamChannelSync)
    teamPlayerService = app.get<TeamPlayerService>(TeamPlayerService)
  })

  /** When a team and team channel is create, the creator needs to be added to the channel */
  it('syncs team with team channel (add player)', async () => {
    const arnold = await playerTestData.createPlayer({ name: 'Arnold' })

    const teamArnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
    })

    const teamChannelSyncStatus = await teamChannelSync.syncTeamChannel(
      teamArnold.teamId,
    )

    // expect team creator to be added to the team channel
    expect(teamChannelSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamArnold.teamId,
      added: [
        {
          playerId: arnold.playerId,
          mattermostUserId: arnold.mattermostUserId,
          channelMembership: arnold.mattermostUserId,
        },
      ],
    })

    expect(teamChannelSyncStatus.added.length).toBe(1)
    // The sync removes the channel creator which is the admin user
    expect(teamChannelSyncStatus.removed.length).toBe(1)
  })

  it('syncs team with team channel (remove player)', async () => {
    const arnold = await playerTestData.createPlayer({ name: 'Arnold' })

    const teamArnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
    })

    const firstTeamChannelSyncStatus = await teamChannelSync.syncTeamChannel(
      teamArnold.teamId,
    )

    // expect team creator to be added to the team channel
    expect(firstTeamChannelSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamArnold.teamId,
      added: [
        {
          playerId: arnold.playerId,
          mattermostUserId: arnold.mattermostUserId,
          channelMembership: arnold.mattermostUserId,
        },
      ],
    })

    // remove arnold from team
    await teamPlayerService.removePlayer(teamArnold.teamId, arnold.playerId)

    const secondTeamChannelSyncStatus = await teamChannelSync.syncTeamChannel(
      teamArnold.teamId,
    )

    expect(secondTeamChannelSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamArnold.teamId,
      removed: [
        {
          mattermostUserId: arnold.mattermostUserId,
          removeStatus: 'OK',
        },
      ],
    })
  })

  it('syncs game chat with challenger and challenged teams (add player)', async () => {
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

    const teamGameChatSyncStatus = await teamChannelSync.syncGameChats(
      teamAarnold.teamId,
    )

    expect(teamGameChatSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamAarnold.teamId,
      teamName: teamAarnold.name,
      teamPlayers: [
        {
          playerId: arnold.playerId,
          mattermostUserId: arnold.mattermostUserId,
        },
      ],
    })

    const gameChatSyncStatuses = teamGameChatSyncStatus.gameChatSyncStatuses

    const gameChatSyncStatus = gameChatSyncStatuses.find(
      (s) => s.gameChatId === gameChat.gameChatId,
    )

    expect(gameChatSyncStatus).toMatchObject({
      synced: expect.any(Date),
      gameChatId: gameChat.gameChatId,
      channelId: gameChat.channelId,
      added: [
        {
          playerId: arnold.playerId,
          mattermostUserId: arnold.mattermostUserId,
          channelMembership: arnold.mattermostUserId,
        },
        {
          playerId: gerald.playerId,
          mattermostUserId: gerald.mattermostUserId,
          channelMembership: gerald.mattermostUserId,
        },
      ],
    })
  })

  it('syncs game chat with challenger and challenged teams (remove player)', async () => {
    const arnold = await playerTestData.createPlayer({ name: 'Arnold' })
    const gerald = await playerTestData.createPlayer({ name: 'Gerald' })

    const teamArnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
    })
    const teamGerald = await teamTestData.createTeam({
      name: 'Team Gerald',
      creatorId: gerald.playerId,
    })

    const challenge = await teamChallengeTestData.createChallenge({
      challengerTeamId: teamArnold.teamId,
      challengedTeamId: teamGerald.teamId,
      status: ChallengeStatus.ACCEPTED,
    })

    const gameChat = await gameChatService.create(challenge)

    const firstTeamGameChatSyncStatus = await teamChannelSync.syncGameChats(
      teamArnold.teamId,
    )

    expect(firstTeamGameChatSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamArnold.teamId,
      teamName: teamArnold.name,
      teamPlayers: [
        {
          playerId: arnold.playerId,
          mattermostUserId: arnold.mattermostUserId,
        },
      ],
      gameChatSyncStatuses: [
        {
          synced: expect.any(Date),
          gameChatId: gameChat.gameChatId,
          channelId: gameChat.channelId,
          added: [
            {
              playerId: arnold.playerId,
              mattermostUserId: arnold.mattermostUserId,
              channelMembership: arnold.mattermostUserId,
            },
            {
              playerId: gerald.playerId,
              mattermostUserId: gerald.mattermostUserId,
              channelMembership: gerald.mattermostUserId,
            },
          ],
        },
      ],
    })

    await teamPlayerService.removePlayer(teamArnold.teamId, arnold.playerId)

    const secondTeamGameChatSyncStatus = await teamChannelSync.syncGameChats(
      teamArnold.teamId,
    )

    expect(secondTeamGameChatSyncStatus).toMatchObject({
      synced: expect.any(Date),
      teamId: teamArnold.teamId,
      teamName: teamArnold.name,
      teamPlayers: [],
      gameChatSyncStatuses: [
        {
          synced: expect.any(Date),
          gameChatId: gameChat.gameChatId,
          channelId: gameChat.channelId,
          removed: [
            {
              mattermostUserId: arnold.mattermostUserId,
              removeStatus: 'OK',
            },
          ],
        },
      ],
    })
  })
})
