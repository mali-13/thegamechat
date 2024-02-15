import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { TeamTestData } from './team.test-data'
import { PlayerTestData } from '../player/player.test-data'
import { PlayerModule } from '../player/player.module'
import { TeamCreatorModule } from './team-creator/team-creator.module'

describe('TeamController (e2e)', () => {
  let app: INestApplication

  let teamTestData: TeamTestData
  let playerTestData: PlayerTestData

  let arnold
  let teamArnold

  async function initTestData() {
    arnold = await playerTestData.createPlayer({ name: 'Arnold' })

    //Rule: Add creator as a team player
    teamArnold = await teamTestData.createTeam({
      name: 'Team Arnold',
      creatorId: arnold.playerId,
    })
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PlayerModule, TeamCreatorModule],
      providers: [TeamTestData, PlayerTestData],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    teamTestData = app.get<TeamTestData>(TeamTestData)
    playerTestData = app.get<PlayerTestData>(PlayerTestData)
    await initTestData()
  })

  it('/teams (GET)', async () => {
    const { body: teams } = await request(app.getHttpServer())
      .get('/teams')
      .expect(200)

    const team = teams.find((team) => team.teamId === teamArnold.teamId)

    expect(team).toMatchObject({
      name: teamArnold.name,
      playerCount: 1,
      //Rule: Team is considered established if it has at least 5 players
      established: false,
    })
  })
})
