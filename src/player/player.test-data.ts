import { INestApplication } from '@nestjs/common'
import { PlayerService } from './player.service'
import { CreatePlayerDto } from './player.dto'

const defaultPlayer: CreatePlayerDto = {
  name: 'Eric Fromm',
  password: '555222',
}

export function createPlayer(
  player: Partial<CreatePlayerDto>,
  app: INestApplication,
) {
  const playerService = app.get<PlayerService>(PlayerService)

  return playerService.savePlayer({
    ...defaultPlayer,
    ...player,
  })
}
