import { Test, TestingModule } from '@nestjs/testing'
import { PlayerService } from './player.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Player } from './player.entity'
import { createMock } from '@golevelup/ts-jest'
import { Repository } from 'typeorm'

describe('PlayerService', () => {
  let service: PlayerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: createMock<Repository<Player>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile()

    service = module.get<PlayerService>(PlayerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
