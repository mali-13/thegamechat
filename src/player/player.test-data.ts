import { PlayerService } from './player.service'
import { CreatePlayerDto } from './player.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PlayerTestData {
  defaultPlayer: CreatePlayerDto = {
    name: 'Eric Fromm',
    password: '555222',
  }

  constructor(private readonly playerService: PlayerService) {}

  createPlayer(player: Partial<CreatePlayerDto>) {
    return this.playerService.savePlayer({
      ...this.defaultPlayer,
      ...player,
    })
  }
}
