import { PlayerService } from './player.service'
import { Injectable } from '@nestjs/common'
import { Player } from './player.entity'
import { PlayerCreatorService } from './player-creator/player-creator.service'
import { CreatePlayerDto } from './player.dto'

@Injectable()
export class PlayerTestData {
  defaultPartialPlayer: Player = {
    name: 'Eric Fromm',
    mattermostUserId: 'test-mattermost-user-id',
  }

  constructor(
    private readonly playerService: PlayerService,
    private readonly playerCreatorService: PlayerCreatorService,
  ) {}

  createPartial(player: Partial<Player>) {
    return this.playerService.save({
      ...this.defaultPartialPlayer,
      ...player,
    })
  }

  defaultPlayer: CreatePlayerDto = {
    name: 'Eric Fromm',
    password: '555222',
  }

  createPlayer(player: Partial<CreatePlayerDto>) {
    return this.playerCreatorService.savePlayer({
      ...this.defaultPlayer,
      ...player,
    })
  }
}
