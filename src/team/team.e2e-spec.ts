import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { TeamTestData } from './team.test-data'
import { PlayerTestData } from '../player/player.test-data'
import { PlayerModule } from '../player/player.module'
import { TeamCreatorModule } from './team-creator/team-creator.module'
import { TeamPlayerService } from './team-player/team-player.service'
import { PlayerCreatorModule } from '../player/player-creator/player-creator.module'

describe('TeamController (e2e)', () => {
  let app: INestApplication

  let teamTestData: TeamTestData
  let playerTestData: PlayerTestData

  let arnold
  let teamArnold

  let teamPlayerService: TeamPlayerService

  async function initTestData() {
    arnold = await playerTestData.createPlayer({ name: 'Arnold' })

    //Rule: Add creator as a team player
    teamArnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
      location: 'HillWood',
    })
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        PlayerModule,
        PlayerCreatorModule,
        TeamCreatorModule,
      ],
      providers: [TeamTestData, PlayerTestData],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    teamTestData = app.get<TeamTestData>(TeamTestData)
    playerTestData = app.get<PlayerTestData>(PlayerTestData)

    teamPlayerService = app.get<TeamPlayerService>(TeamPlayerService)

    await initTestData()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('/teams (GET)', async () => {
    const { body: teams } = await request(app.getHttpServer())
      .get('/teams')
      .expect(200)

    const team = teams.find((team) => team.teamId === teamArnold.teamId)

    expect(team).toMatchObject({
      name: teamArnold.name,
      playerCount: 1,
      playerAverageAge: 18,
      //Rule: Team is considered established if it has at least 5 players
      established: false,
      location: 'HillWood',
    })
  })

  it('/teams?established=true (GET)', async () => {
    const establishedTeam = await teamTestData.createTeam({
      name: 'Established team',
      creatorId: arnold.playerId,
    })

    const numberOfPlayersToAdd = 4

    for (let i = 0; i < numberOfPlayersToAdd; i++) {
      await teamPlayerService.addPlayer(establishedTeam.teamId, {
        playerId: (await playerTestData.createPartial({ name: 'Gerald' }))
          .playerId,
      })
    }

    const { body: teams } = await request(app.getHttpServer())
      .get('/teams')
      .query({ established: true })
      .expect(200)

    const team = teams.find((team) => team.teamId === establishedTeam.teamId)

    expect(team).toMatchObject({
      name: establishedTeam.name,
      playerCount: 5,
      //Rule: Team is considered established if it has at least 5 players
      established: true,
    })

    expect(teams.some((team) => !team.established)).toBe(false)
  })
})
