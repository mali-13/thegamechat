import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../app.module'
import { PlayerModule } from './player.module'
import { PlayerService } from './player.service'
import { Player } from './player.entity'

describe('TeamController (e2e)', () => {
  let app: INestApplication

  let playerService: PlayerService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PlayerModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    playerService = app.get<PlayerService>(PlayerService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('player service creates player', async () => {
    const player: Player = {
      name: 'Player',
      mattermostUserId: 'my-mattermost-user-id',
      location: 'Shkoder',
      age: 18,
    }

    const savedPlayer = await playerService.save(player)

    expect(savedPlayer).toMatchObject(player)
  })
})
